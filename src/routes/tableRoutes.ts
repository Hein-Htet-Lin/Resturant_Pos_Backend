import {Router} from "express";
import * as tableCtrl from "../controllers/tableController";
import { CreateTableSchema } from "../schema/tableSchema";
import { registry } from "../../lib/swagger";
import {z} from "zod"

const router = Router();
const TAG = ['Table']

// 1 GET ALL TABLE
registry.registerPath({
    method:'get',
    path:'/api/tables',
    summary:'Get All Tables',
    tags:TAG,
    responses:{200:{
                description:'A list of tables with their orders',
                content:{"application/json":{schema:z.array(CreateTableSchema.extend({id:z.number()}))}}
            }}
})



// 2 CREATE TABLE
registry.registerPath({
    method:"post",
    path:"/api/tables",
    summary:"Create a new Table",
    tags : TAG,
    request:{body:{content:{"application/json":{schema:CreateTableSchema}}}},
    responses:{201:{description:"Created"}}

})



// --- Express Routes ---
router.get('/', tableCtrl.getAllTables);
router.post('/',tableCtrl.createTable);

export default router;