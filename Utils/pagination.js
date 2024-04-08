import { Op } from "sequelize";
const paginate = function (model) {
    model.paginate = async function (args) {
        const where = args.where || {};
        const page = args.page;
        const size = args.size;
        const sort = args.sort || "";
        const searchable = args.searchable || [];
        const database = args.database || process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;
        let data = { where };
        let query = { page: page - 1, size, sort };

        // const newPage = parseInt(query.page) - 1;
        // const size = parseInt(query.size);
        // const sort = query.sort;

        const search = query.search;
        if (!(isNaN(page) || isNaN(size) || page <= 0 || size < 1)) {
            data.offset = parseInt(query.page * size);
            data.limit = parseInt(size);
        }

        if (sort) {
            if (sort.split(",").length == 2) {
                const sortData = sort.split(",");
                data.order = [sortData];
            }
        }
        if (searchable.length && search) {
            data.where = {
                [Op.or]: searchable.map((el) => {
                    return { [el]: { [Op.like]: `%${search}%` } };
                }),
            };
        }
        const temp = await model.schema(database).findAndCountAll({ ...data });
        return pageInfo(temp, query, searchable);
    };
};
export const pageInfo = (info, query = {}, searchable = []) => {
    const data = info.rows;
    const currentPage = parseInt(query.page + 1);
    const size = parseInt(query.size);
    const totalElements = parseInt(info.count);
    const sort = query.sort;
    const search = query.search;
    let pageDetails = {
        data: data,
        page: {
            pagination: false,
            totalElements,
            currentPage: 1,
            size: totalElements,
            totalPages: 1,
        },
        sort: { sorted: false, sortBy: null, sortedBy: null },
        search: { searched: false, searchedBy: null, searchedIn: null },
    };

    if (typeof currentPage == "number" && currentPage > 0 && size > 0) {
        pageDetails.page.currentPage = currentPage;
        pageDetails.page.totalPages = Math.ceil(info.count / size);
        pageDetails.page.size = size;
        pageDetails.page.pagination = true;
    }
    if (sort && sort.split(",").length == 2) {
        pageDetails.sort.sorted = true;
        pageDetails.sort.sortedBy = sort.split(",")[0];
        pageDetails.sort.sortBy = sort.split(",")[1];
    }
    if (search) {
        pageDetails.search.searched = true;
        pageDetails.search.searchedBy = search;
        pageDetails.search.searchedIn = searchable.join(",");
    }
    return pageDetails;
};

export default paginate;
