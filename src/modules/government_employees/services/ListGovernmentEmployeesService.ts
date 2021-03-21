import puppeteer from 'puppeteer';
import { injectable, inject } from 'tsyringe';

import GovernmentEmployee, {
  EmployeeType,
} from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';
import ApplyGovernmentEmployeeTypeFilterService from '@modules/government_employees/services/ApplyGovernmentEmployeeTypeFilterService';
import DetailOrganService from '@modules/government_employees/services/DetailOrganService';

const PORTAL_TRANSPARENCIA_SERVIDORES_ORGAO_URL =
  'http://www.portaltransparencia.gov.br/servidores/orgao';

const SEARCH_WITH_FILTERS_BUTTON_ELEMENT =
  '#box-filtros-aplicados-com-botao > p > button.btn-consultar.btn-filtros-aplicados-consultar';

interface IRequest {
  employee_types?: EmployeeType[];
  superior_army_organ: string;
  army_organ: string;
}

@injectable()
export default class ListGovernmentEmployeesService {
  private applyGovernmentEmployeeTypeFilter: ApplyGovernmentEmployeeTypeFilterService;

  private detailOrgan: DetailOrganService;

  constructor(
    @inject('GovernmentEmployeeSearchLogsRepository')
    private governmentEmployeeSearchLogsRepository: IGovernmentEmployeeSearchLogsRepository,
  ) {
    this.applyGovernmentEmployeeTypeFilter = new ApplyGovernmentEmployeeTypeFilterService();
    this.detailOrgan = new DetailOrganService();
  }

  public async execute({
    employee_types,
    superior_army_organ,
    army_organ,
  }: IRequest): Promise<GovernmentEmployee[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto(PORTAL_TRANSPARENCIA_SERVIDORES_ORGAO_URL);

    await this.applyGovernmentEmployeeTypeFilter.execute({
      page,
      employee_types,
    });

    const searchWithFiltersButtonElement = await page.$(
      SEARCH_WITH_FILTERS_BUTTON_ELEMENT,
    );

    if (searchWithFiltersButtonElement) {
      await searchWithFiltersButtonElement.click();
    }

    await page.waitForSelector(
      '#spinner[style="margin: 50px 50% 500px; display: none;"]',
    );

    await this.detailOrgan.execute({
      page,
      superior_army_organ,
      army_organ,
    });

    await page.waitForSelector(
      '#spinner[style="margin: 50px 50% 500px; display: none;"]',
    );

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

    await browser.close();

    return governmentEmployees;
  }
}
