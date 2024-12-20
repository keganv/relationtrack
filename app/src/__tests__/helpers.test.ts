import { checkFileType, removeUndefined } from '../lib/helpers.ts';

test('checkFileType should allow correct types', () => {
  const jpg = new File([''], 'test.jpg', { type: 'image/jpeg'});
  const allowed = checkFileType(jpg);
  expect(allowed).toEqual(true);

  const exe = new File([''], 'test.exe', { type: 'application/octet-stream'});
  const safe = checkFileType(exe);
  expect(safe).toEqual(false);
});

test('removeUndefined removes any properties that are undefined', () => {
  const testObj = { name: 'Kegan', age: 41, test: undefined };
  const cleaned = removeUndefined(testObj);
  expect(cleaned).toMatchObject({"age": 41, "name": "Kegan"});
});
