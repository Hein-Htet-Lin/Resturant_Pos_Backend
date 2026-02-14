import type {Request,Response} from "express"
// import { Prisma } from "../../generated/prisma/client"
import { CreateProductSchema } from "../schema/productSchema"
import { prisma } from "../../lib/prisma";

export const createProduct = async(req:Request,res:Response)=>{
    try{
        const validateData = CreateProductSchema.parse(req.body);
        
        const {id,...createData} = validateData;

        const product = await prisma.product.create({ 
            data : createData
         })
         res.status(201).json(product)
    }catch(error:any){
        res.status(400).json({error:error.message})
    }
}

export const getProducts = async(req:Request,res:Response)=>{
    try{

        const products = await prisma.product.findMany({
            include:{category:true}
        });
        res.json(products);
    }catch(error:any){
        res.status(400).json({error:error.message})
    }
}

export const getProductById = async(req:Request,res:Response)=>{
    const {id} = req.params
    try {
        const product = await prisma.product.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            category:true
        }
    })
    if(!product){
        res.status(404).json({message:"Product Not Found"});
    }
    res.json(product);
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }

}

export const updateProduct = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params;
        const validatedData = CreateProductSchema.partial().parse(req.body);
        // console.log(validatedData)

        const filterData = Object.fromEntries(
            Object.entries(validatedData).filter(([_,v])=> v !==undefined)
        )

        // console.log(filterData)
        
        
        const {id:_,...updateData} = filterData;
        
        console.log(id,validatedData);


        const updateProduct = await prisma.product.update({
            where:{
                id:Number(id)
            },
            data:updateData
        })

        res.status(201).json(updateProduct)
    }catch(error:any){
        res.status(500).json({error:error.message})
    }
}