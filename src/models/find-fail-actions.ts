import {SearchActions} from "./search-actions.js";
import {NotFound} from "../errors/not-found.js";

export abstract class FindFailActions extends SearchActions {

  /**
   * Returns fist matching record or throws NotFound exception
   * @throws NotFound
   */
  public async firstOrFail<T>(): Promise<T>;
  public async firstOrFail(): Promise<any> {
    const record = await this.first();

    if (!record) {
      throw new NotFound();
    }

    return record;
  }

  /**
   * Finds the record on primary key or throws error
   * @param id
   * @throws NotFound
   */
  public async findOrFail<T>(id: any): Promise<T | null>;
  public async findOrFail(id: any): Promise<any | null> {
    const record = await this.find(id);
    if (!record) {
      throw new NotFound();
    }

    return record;
  }

  /**
   * Finds value at index or throws NotFound exception.
   * @param indexName
   * @param id
   * @throws NotFound
   */
  public async findIndexOrFail<T>(indexName: string, id: any): Promise<T>;
  public async findIndexOrFail(indexName: string, id: any): Promise<any> {
    const record = await this.findIndex(indexName, id);
    if (!record) {
      throw new NotFound();
    }

    return record;
  }

}
