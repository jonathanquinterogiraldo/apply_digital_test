import { validate } from 'class-validator';
import { IsValidDateRange } from './is-valid-date-range.decorator';

@IsValidDateRange()
class TestDto {
  startDate?: string;
  endDate?: string;
}

describe('IsValidDateRange (class decorator)', () => {
  it('✅ should be valid if startDate <= endDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2023-01-01';
    dto.endDate = '2023-01-10';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('✅ should be valid if one of the dates is missing', async () => {
    const dto = new TestDto();
    dto.startDate = '2023-01-01';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('❌ should return error if startDate > endDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2023-01-10';
    dto.endDate = '2023-01-01';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsValidDateRange).toBe(
      'startDate must be less than or equal to endDate',
    );
  });
});
