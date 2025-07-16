import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
export   async function register(req,res){
    const {name,email,password,role='user'}=req.body;

    try {
        const hashed=await bcrypt.hash(password,10)
        const result=await Pool.query(
            'INSERT INTO users (name ,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *',[name,email,hashed,role]
        );
        res.status(201).json({message:'user registered', user:result.row[0]});

    } catch (err) {
        res.status(500).json({error:'registration failed'});

        
    }

    
}


export  async function login(req,res) {

    const {email,password}=req.body;
    try {
        const result =await Pool.query('SELECT * FROM USER WHERE email=$1',[email]);
        const user=result.row[0];
        if(!user)return res.status(401).json({error:'user not found'});
        const valid =await bcrypt.compare(password,user.password);
        if(!valid) return res.status(401).json({error:"invalid credentials"})

        const token =jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET);
        res.json({token})
        
    } catch (err) {
        res.status(500).json({error:'login failed'})
        
    }
}

