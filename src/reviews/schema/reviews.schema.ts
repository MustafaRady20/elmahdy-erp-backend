import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type ReviewDocument = Review & Document
@Schema({timestamps:true})
export class Review {
    @Prop({required:true})
    userName:string

    @Prop({type:Number,default:0,required:true})
    rating:number

    @Prop({required:true})
    comment:string

}

export const ReviewSchema = SchemaFactory.createForClass(Review)