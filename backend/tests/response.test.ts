import { successResponse, errorResponse } from '../src/utils/response.js';

describe('Response Utils', () => {
  describe('successResponse', () => {
    it('should create a success response with data', () => {
      const res = successResponse({ id: 1, name: 'test' });
      expect(res).toEqual({
        success: true,
        message: 'Success',
        data: { id: 1, name: 'test' },
      });
    });

    it('should use custom message', () => {
      const res = successResponse({ id: 1 }, 'Custom message');
      expect(res.message).toBe('Custom message');
    });

    it('should handle null data', () => {
      const res = successResponse(null);
      expect(res.success).toBe(true);
      expect(res.data).toBeNull();
    });

    it('should handle array data', () => {
      const res = successResponse([1, 2, 3]);
      expect(res.data).toEqual([1, 2, 3]);
    });
  });

  describe('errorResponse', () => {
    it('should create an error response', () => {
      const res = errorResponse('Something went wrong');
      expect(res).toEqual({
        success: false,
        message: 'Something went wrong',
        data: null,
        errors: undefined,
      });
    });

    it('should always have data field as null', () => {
      const res = errorResponse('Error');
      expect(res.data).toBeNull();
    });
  });
});
