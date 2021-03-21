import { Page } from 'puppeteer';
import { injectable } from 'tsyringe';

import { EmployeeType } from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';

type EmployeeTypeLabelSelectors = {
  [K in EmployeeType]: string;
};

const EMPLOYEE_TYPE_CHECKBOX_SELECTORS: EmployeeTypeLabelSelectors = {
  militar:
    '#id-box-filtro > div > div > ul > li:nth-child(2) > div > div > div > div.gaveta__corpo > div.btn-group > ul > li:nth-child(3) > a > label',
  civil:
    '#id-box-filtro > div > div > ul > li:nth-child(2) > div > div > div > div.gaveta__corpo > div.btn-group > ul > li:nth-child(4) > a > label',
};

interface IRequest {
  page: Page;
  employee_types?: EmployeeType[];
}

@injectable()
export default class ApplyGovernmentEmployeeTypeFilterService {
  public async execute({ page, employee_types }: IRequest): Promise<void> {
    if (employee_types?.length) {
      /* istanbul ignore next */
      await page.evaluate(() => {
        const EMPLOYEE_TYPE_BUTTON_ELEMENT_SELECTOR =
          '#id-box-filtro > div > div > ul > li:nth-child(2) > div > button';

        document
          .querySelector<HTMLElement>(EMPLOYEE_TYPE_BUTTON_ELEMENT_SELECTOR)
          ?.click();
      });

      for (const employee_type of employee_types) {
        const employeeTypeCheckboxElementSelector =
          EMPLOYEE_TYPE_CHECKBOX_SELECTORS[employee_type];

        await page.waitForSelector(employeeTypeCheckboxElementSelector);

        /* istanbul ignore next */
        await page.evaluate(checkboxElementSelector => {
          document.querySelector(checkboxElementSelector).click();
        }, employeeTypeCheckboxElementSelector);
      }
    }

    /* istanbul ignore next */
    await page.evaluate(() => {
      const ADD_EMPLOYEE_TYPE_FILTERS_ELEMENT_BUTTON_SELECTOR =
        '#id-box-filtro > div > div > ul > li:nth-child(2) > div > div > div > div.gaveta__corpo > div.btn-group > ul > li:nth-child(2) > input';

      document
        .querySelector<HTMLElement>(
          ADD_EMPLOYEE_TYPE_FILTERS_ELEMENT_BUTTON_SELECTOR,
        )
        ?.click();
    });
  }
}
