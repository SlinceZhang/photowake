import { ResponseEnvelopeDto } from '../dto';

export const buildResponse = <TData>(
  data: TData,
  message = 'Request successful',
): ResponseEnvelopeDto<TData> => ({
  success: true,
  message,
  timestamp: new Date().toISOString(),
  data,
});
