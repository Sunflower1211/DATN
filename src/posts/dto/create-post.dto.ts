import { IsString } from 'class-validator';
export class CreatePostDto {
    @IsString()
    user_id: any;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    exp: string;

    @IsString()
    candidate_requirement: string;

    @IsString()
    interest: string;

    @IsString()
    address: string;

    @IsString()
    salary: string;
}
