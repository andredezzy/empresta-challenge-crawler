import { Page } from 'puppeteer';
import { injectable } from 'tsyringe';

interface IRequest {
  page: Page;
  superior_army_organ: string;
  army_organ: string;
}

@injectable()
export default class DetailOrganService {
  public async execute({
    page,
    superior_army_organ,
    army_organ,
  }: IRequest): Promise<void> {
    /* istanbul ignore next */
    await page.evaluate(
      (findSuperiorArmyOrgan, findArmyOrgan) => {
        const ORGANS_TABLE_ROWS_SELECTOR = '#lista > tbody > tr';

        const ORGANS_TABLE_SUPERIOR_ARMY_ORGAN_COLUMN_SELECTOR =
          'td.coluna-livre.sorting_1 > span';
        const ORGANS_TABLE_ARMY_ORGAN_COLUMN_SELECTOR =
          'td:nth-child(3) > span';

        const DETAIL_ANCHOR_ELEMENT_SELECTOR = 'td:nth-child(1) > span > a';

        const rowElements = document.querySelectorAll(
          ORGANS_TABLE_ROWS_SELECTOR,
        );

        const rows: Element[] = [];

        rowElements.forEach(row => rows.push(row));

        const findRow = rows.find(row => {
          const superiorArmyOrgan = row
            .querySelector(ORGANS_TABLE_SUPERIOR_ARMY_ORGAN_COLUMN_SELECTOR)
            ?.textContent?.trim();

          const armyOrgan = row
            .querySelector(ORGANS_TABLE_ARMY_ORGAN_COLUMN_SELECTOR)
            ?.textContent?.trim();

          return (
            superiorArmyOrgan === findSuperiorArmyOrgan &&
            armyOrgan === findArmyOrgan
          );
        });

        const detailAnchorElement = findRow?.querySelector<HTMLElement>(
          DETAIL_ANCHOR_ELEMENT_SELECTOR,
        );

        detailAnchorElement?.click();
      },
      superior_army_organ,
      army_organ,
    );

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }
}
