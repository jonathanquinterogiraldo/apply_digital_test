import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductDto {
  @ApiProperty({
    description: 'Unique identifier of the product to be deleted',
    example: 'a1b2c3d4e5',
  })
  @IsString()
  id: string;
}
