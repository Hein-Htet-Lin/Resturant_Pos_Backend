import type { Request,Response } from "express";
import { CreateTableSchema } from "../schema/tableSchema";
import {prisma} from "../../lib/prisma"

export const createTable = async(req:Request,res:Response) => {
    try {
        const validateData = CreateTableSchema.parse(req.body);
        const {id, ...data} = validateData

        const table = await prisma.table.create({
            data : data
        })
        res.status(201).json(table)
    } catch (error:any) {
        res.status(400).json({error:error.message})
    }
}

export const getAllTables = async(req:Request,res:Response)=>{
    try {
        const tables = await prisma.table.findMany({
            orderBy:{
                id:"asc"
            },
            include:{orders:true}
        });
        if(tables){
            res.json(tables)
        }
    } catch (error:any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

