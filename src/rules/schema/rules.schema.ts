import { Prop, Schema } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class Rules extends Document{
    @Prop({type:String,required:true})
    title:string
    
    @Prop({type:String,required:true})
    description:string
}