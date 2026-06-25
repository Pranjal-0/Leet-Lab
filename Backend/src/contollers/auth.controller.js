import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";




export const register = async (req,res) => {
    const {email,name,password} = req.body;
    // console.log(email,name,password)
    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })
        console.log(existingUser)

        if(existingUser){
            return res.status(400).json({
                error:"User existing exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10); 
        
        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER

            }
        })

        const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,{
            expiresIn:"1d"
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:100*60*60*24*7,
        })

        res.status(201).json({
            message:"User created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }
        })

    } catch (error) {
        console.error("Error creating user:" ,error);
        res.status(500).json({
            error:"Error creating user"
        })
        
    }

}
export const login = async (req,res) => {
    const{email,password} = req.body;
    try {
        const user = await db.user.findUnique({
            where:{
                email   
            }
        })

        if(!user){
            return res.status(401).json({
                error:"user not found"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);



        if(!isMatch){
            return res.status(401).json({
                error:"invalid credentials"
            })
        }

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
            expiresIn:"1d"
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:100*60*60*24*7,
        })

        res.status(200).json({
            message:"User loggedIn successfully",
            user:{
                id:user.id,
                email:user.email, 
                name:user.name,
                role:user.role,
                image:user.image
            }
        })

    } catch (error) {
        console.error("Error creating user:" ,error);
        res.status(500).json({
            error:"Error logging user"
        })
        
    }

}
export const logout = async (req,res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        res.status(204).json({
            success:true,
            message:"User logged out sucessfully"
        })

    } catch (error) {
        console.error("Error creating user:" ,error);
        res.status(500).json({
            error:"Error logging user"
        })
        
    }
}
export const check = async (req,res) => {
    try {
        res.status(200).json({
            success:true,
            message:"user authenticated successfully",
            user:req.user
        })
    }  catch (error) {
        console.error("Error creating user:" ,error);
        res.status(500).json({
            error:"Error geting user"
        })
        
    }
}
