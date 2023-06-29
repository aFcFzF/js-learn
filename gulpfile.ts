import path from 'path';
import del from 'del';
import { globSync } from 'glob';
import gulp from 'gulp';
import babel from 'gulp-babel';
import ts from 'gulp-typescript';
import merge from 'merge2';
import * as fs from 'fs';
import tsConfig from './tsconfig.json';

const getBabelConfig = (modules: 'commonjs' | false): Record<string, unknown> => ({
  comments: false,
  presets: ([
    [
      '@babel/preset-env',
      {
        modules,
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'not ie <= 8',
          ],
        },
      },
    ],
  ]),
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false,
      },
    ],
    '@babel/plugin-transform-runtime',
  ],
});

const resolve = (...args: string[]): string => path.resolve(__dirname, ...args);

const gulpPackages: string[] = [];

const files: string[] = [];

globSync('packages/*').forEach((name) => {
  const pkg = JSON.parse(fs.readFileSync(`./${name}/package.json`, 'utf8'));

  if (pkg.private || pkg.scripts?.build) {
    return;
  }

  gulpPackages.push(name);

  files.push(
    `${name}/src/**/*.ts`,
    `${name}/src/**/*.tsx`,
    `!${name}/src/**/__tests__/**`,
  );
});

const createDelTask = (name: string): string => {
  const cwd = resolve('packages', name);

  const taskName = `del-${name}`;
  gulp.task(taskName, () => del(['lib', 'es', 'ts'], { cwd }));

  return taskName;
};


function createBuildTask(name: string): string {
  const cwd = resolve('packages', name);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  // const tsConfig = require(resolve(cwd, 'tsconfig.json'));

  gulp.task(`build-ts-${name}`, () => {
    const realConfig = Object.assign({}, tsConfig.compilerOptions, {
      module: 'esnext',
      target: 'es2018',
      rootDir: resolve('.'),
      outDir: resolve('dist/ts'),
      declaration: true,
      declarationDir: resolve('dist/ts'),
    });

    // 分开tsconfig搞编译
    // 之前是base: packages, 会编到子目录； 改为cwd，会都编到1个目录。
    const result = gulp.src(['src/**/*.ts'], { cwd }).pipe(ts(realConfig));

    return merge([
      result.js.pipe(gulp.dest('ts', { cwd })),
      result.dts.pipe(gulp.dest('lib', { cwd })).pipe(gulp.dest('es', { cwd })),
    ]);
  });

  gulp.task(`build-lib-${name}`, () => {
    const stream = gulp
      .src('ts/**', { cwd })
      .pipe(babel(getBabelConfig('commonjs')));

    return stream.pipe(gulp.dest('lib', { cwd }));
  });

  gulp.task(`build-es-${name}`, () => {
    const stream = gulp
      .src('ts/**', { cwd })
      .pipe(babel(getBabelConfig(false)));

    return stream.pipe(gulp.dest('es', { cwd }));
  });

  // ts目录删掉
  gulp.task(`del-ts-${name}`, () => del(['ts'], { cwd }));

  const tasks = [`build-ts-${name}`, `build-lib-${name}`, `build-es-${name}`, `del-ts-${name}`];

  gulp.task(`build-${name}`, gulp.series(tasks));

  return `build-${name}`;
};

const buildTasks: string[] = [];
const delTasks: string[] = [];

gulpPackages.forEach((packagePath) => {
  const name = packagePath.slice(9);
  buildTasks.push(createBuildTask(name));
  delTasks.push(createDelTask(name));
});

gulp.task('default', gulp.series(
  ...delTasks,
  ...buildTasks,
));
