import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as SwaggerApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseEnvelopeDto } from '../dto';

interface ApiResponseDecoratorOptions<TModel extends Type<unknown>>
  extends Omit<ApiResponseOptions, 'schema' | 'type'> {
  model: TModel;
  isArray?: boolean;
}

export const ApiResponse = <TModel extends Type<unknown>>({
  description,
  isArray,
  model,
  status = 200,
}: ApiResponseDecoratorOptions<TModel>) => {
  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      }
    : {
        $ref: getSchemaPath(model),
      };

  const responseOptions: ApiResponseOptions = {
    status,
    description,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseEnvelopeDto) },
        {
          properties: {
            data: dataSchema,
          },
        },
      ],
    },
  };

  return applyDecorators(
    ApiExtraModels(ResponseEnvelopeDto, model),
    SwaggerApiResponse(responseOptions),
  );
};
