import puppeteer from 'puppeteer';
import { injectable, inject } from 'tsyringe';

import GovernmentEmployee, {
  EmployeeType,
} from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';
import GovernmentEmployeeSearchLog from '@modules/government_employees/infra/typeorm/schemas/GovernmentEmployeeSearchLog';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';
import ApplyGovernmentEmployeeTypeFilterService from '@modules/government_employees/services/ApplyGovernmentEmployeeTypeFilterService';
import DetailOrganService from '@modules/government_employees/services/DetailOrganService';
import GovernmentEmployeesPaginationService from '@modules/government_employees/services/GovernmentEmployeesPaginationService';

const PORTAL_TRANSPARENCIA_SERVIDORES_ORGAO_URL =
  'http://www.portaltransparencia.gov.br/servidores/orgao';

const SEARCH_WITH_FILTERS_BUTTON_ELEMENT_SELECTOR =
  '#box-filtros-aplicados-com-botao > p > button.btn-consultar.btn-filtros-aplicados-consultar';

export const FINISH_LOADING_SPINNER_ELEMENT_SELECTOR =
  '#spinner[style="margin: 50px 50% 500px; display: none;"]';

interface IRequest {
  employee_types?: EmployeeType[];
  superior_army_organ: string;
  army_organ: string;
  page?: number;
}

@injectable()
export default class ListGovernmentEmployeesService {
  private applyGovernmentEmployeeTypeFilter: ApplyGovernmentEmployeeTypeFilterService;

  private detailOrgan: DetailOrganService;

  private governmentEmployeesPagination: GovernmentEmployeesPaginationService;

  constructor(
    @inject('GovernmentEmployeeSearchLogsRepository')
    private governmentEmployeeSearchLogsRepository: IGovernmentEmployeeSearchLogsRepository,
  ) {
    this.applyGovernmentEmployeeTypeFilter = new ApplyGovernmentEmployeeTypeFilterService();
    this.detailOrgan = new DetailOrganService();
    this.governmentEmployeesPagination = new GovernmentEmployeesPaginationService();
  }

  public async execute({
    employee_types,
    superior_army_organ,
    army_organ,
    page: goto_page,
  }: IRequest): Promise<GovernmentEmployeeSearchLog> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      headless: true,
    });

    try {
      const page = await browser.newPage();

      await page.goto(PORTAL_TRANSPARENCIA_SERVIDORES_ORGAO_URL, {
        waitUntil: 'networkidle2',
      });

      await this.applyGovernmentEmployeeTypeFilter.execute({
        page,
        employee_types,
      });

      const searchWithFiltersButtonElement = await page.$(
        SEARCH_WITH_FILTERS_BUTTON_ELEMENT_SELECTOR,
      );

      /* istanbul ignore next */
      const searchWithFiltersButtonElementStyleAttr = await page.$eval(
        SEARCH_WITH_FILTERS_BUTTON_ELEMENT_SELECTOR,
        el => el.getAttribute('style'),
      );

      if (!searchWithFiltersButtonElementStyleAttr?.includes('display: none')) {
        await searchWithFiltersButtonElement?.click();
      }

      await page.waitForSelector(FINISH_LOADING_SPINNER_ELEMENT_SELECTOR);

      await this.detailOrgan.execute({
        page,
        superior_army_organ,
        army_organ,
      });

      await page.waitForSelector(FINISH_LOADING_SPINNER_ELEMENT_SELECTOR);

      const {
        current_page,
        total_pages,
      } = await this.governmentEmployeesPagination.execute({ page, goto_page });

      /* istanbul ignore next */
      const governmentEmployees = await page.evaluate(
        (): GovernmentEmployee[] => {
          const TYPE_COLUMN_SELECTOR = 'td:nth-child(2) > span';
          const CPF_COLUMN_SELECTOR = 'td.coluna-cpf > span';
          const NAME_COLUMN_SELECTOR = 'td.coluna-livre.sorting_1 > span';
          const REGISTRATION_COLUMN_SELECTOR = 'td:nth-child(7) > span';

          const data: GovernmentEmployee[] = [];

          const rows = document.querySelectorAll('#lista > tbody > tr');

          rows.forEach(row => {
            const type = row
              .querySelector(TYPE_COLUMN_SELECTOR)
              ?.textContent?.trim();

            const cpf = row
              .querySelector(CPF_COLUMN_SELECTOR)
              ?.textContent?.trim();

            const name = row
              .querySelector(NAME_COLUMN_SELECTOR)
              ?.textContent?.trim();

            const registration = row
              .querySelector(REGISTRATION_COLUMN_SELECTOR)
              ?.textContent?.trim();

            data.push({
              type,
              cpf,
              name,
              registration,
            } as GovernmentEmployee);
          });

          return data;
        },
      );

      const governmentEmployeeSearchLogs = await this.governmentEmployeeSearchLogsRepository.create(
        {
          government_employees: governmentEmployees,
          employee_types: employee_types || [],
          superior_army_organ,
          army_organ,
          page: current_page,
          total_pages,
        },
      );

      return governmentEmployeeSearchLogs;
    } finally {
      await browser.close();
    }
  }
}
