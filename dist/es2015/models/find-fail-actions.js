import { SearchActions } from "./search-actions.js";
import { NotFound } from "../errors/not-found.js";
export class FindFailActions extends SearchActions {
    async firstOrFail() {
        const record = await this.first();
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
    async findOrFail(id) {
        const record = await this.find(id);
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
    async findIndexOrFail(indexName, id) {
        const record = await this.findIndex(indexName, id);
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
}
//# sourceMappingURL=find-fail-actions.js.map