"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClients = exports.createNewClient = void 0;
const company_schema_1 = require("../schema/company.schema");
const db_config_1 = require("../config/db.config");
const createNewClient = async (req, res) => {
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    const { name, number } = company_schema_1.CreateClientSchema.parse(req.body);
    const createClient = await db_config_1.prisma.client.create({
        data: {
            companyId,
            name,
            number,
        },
    });
    return res.status(201).json(createClient);
};
exports.createNewClient = createNewClient;
const getClients = async (req, res) => {
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    const clients = await db_config_1.prisma.client.findMany({
        where: {
            companyId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).json(clients);
};
exports.getClients = getClients;
//# sourceMappingURL=client.controller.js.map