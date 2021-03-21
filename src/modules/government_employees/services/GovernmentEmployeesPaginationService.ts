import { Page } from 'puppeteer';
import { injectable } from 'tsyringe';

import { FINISH_LOADING_SPINNER_ELEMENT_SELECTOR } from '@modules/government_employees/services/ListGovernmentEmployeesService';
import AppError from '@shared/errors/AppError';

const GOVERNMENT_EMPLOYEE_COMPLETE_PAGINATION_BUTTON_SELECTOR =
  '#lista_wrapper > div > div.box-paginacao > div.botao__gera_paginacao_completa > button';

const GOTO_PAGE_INPUT_ELEMENT_SELECTOR = '#paginas-selecao-1-lista';

const GOTO_PAGE_BUTTON_ELEMENT_SELECTOR = '#botao-ir-para-a-pagina-lista';

interface IRequest {
  page: Page;
  goto_page?: number;
}

interface IResponse {
  current_page: number;
  total_pages: number;
}

@injectable()
export default class GovernmentEmployeesPaginationService {
  public async execute({ page, goto_page }: IRequest): Promise<IResponse> {
    const governmentEmployeeCompletePaginationButtonSelector = await page.$(
      GOVERNMENT_EMPLOYEE_COMPLETE_PAGINATION_BUTTON_SELECTOR,
    );

    await governmentEmployeeCompletePaginationButtonSelector?.click();

    await page.waitForSelector(FINISH_LOADING_SPINNER_ELEMENT_SELECTOR);

    /* istanbul ignore next */
    const [current_page, total_pages] = await page.evaluate((): [
      number,
      number,
    ] => {
      const paginationFullText = document
        .querySelector('#lista_info')
        ?.textContent?.trim();

      const splitPagination = paginationFullText
        ?.replace('Página ', '')
        ?.replace(/\./g, '')
        ?.split(' de ');

      return (splitPagination?.map(Number) || []) as [number, number];
    });

    if (goto_page) {
      if (goto_page > total_pages) {
        throw new AppError(`Page greater than total pages`, 400, {
          'X-Total-Pages': total_pages,
        });
      }

      const gotoPageInputElement = await page.$(
        GOTO_PAGE_INPUT_ELEMENT_SELECTOR,
      );

      await gotoPageInputElement?.type(String(goto_page));

      const gotoPageButtonElement = await page.$(
        GOTO_PAGE_BUTTON_ELEMENT_SELECTOR,
      );

      await gotoPageButtonElement?.click();

      await page.waitForSelector(FINISH_LOADING_SPINNER_ELEMENT_SELECTOR);
    }

    return {
      current_page,
      total_pages,
    };
  }
}
