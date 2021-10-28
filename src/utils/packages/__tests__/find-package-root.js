'use strict';

jest.mock('fs/promises');

const { createError } = require('../../../../test/mockSystemErrors');
const mockedFS = /** @type {tests.mocks.FSPromisesModule} */ (require('fs/promises'));
const findPackageRoot = require('../find-package-root').findPackageRoot;

describe('findPackageRoot', () => {
	it('should resolve the package directory when package.json is present', async () => {
		mockedFS.__mockFileSystem({
			foo: {
				bar: {
					'package.json': '{}',
					baz: {},
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBe('foo/bar');
	});

	it('should resolve the package directory when starting with a file path', async () => {
		mockedFS.__mockFileSystem({
			foo: {
				bar: {
					'package.json': '{}',
					baz: '',
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBe('foo/bar');
	});

	it('should resolve the package directory when starting with a file path on a platform that throws ENOTDIR', async () => {
		mockedFS.__mockFileSystem({
			foo: {
				bar: {
					'package.json': '{}',
					baz: createError('ENOTDIR', 'foo/bar/baz', -20, 'stat'),
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBe('foo/bar');
	});

	it("should not resolve when package.json isn't in the tree", async () => {
		mockedFS.__mockFileSystem({
			foo: {
				bar: {
					baz: {},
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBeUndefined();
	});

	it('should not resolve folders with a directory named package.json', async () => {
		mockedFS.__mockFileSystem({
			foo: {
				'package.json': '{}',
				bar: {
					'package.json': {},
					baz: {},
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBe('foo');

		mockedFS.__mockFileSystem({
			foo: {
				'package.json': {},
				bar: {
					baz: {},
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBeUndefined();

		mockedFS.__mockFileSystem({
			'package.json': {},
			foo: {
				bar: {
					baz: {},
				},
			},
		});

		expect(await findPackageRoot('foo/bar/baz')).toBeUndefined();
	});

	it('should throw when encountering a file system error other than ENOENT or ENOTDIR', async () => {
		mockedFS.__mockFileSystem({
			foo: {
				bar: {
					baz: createError('EACCES', 'foo/bar/baz', -13, 'stat'),
				},
			},
		});

		await expect(findPackageRoot('foo/bar/baz')).rejects.toThrowErrorMatchingSnapshot();
	});
});