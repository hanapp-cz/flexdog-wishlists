type TSegments = Record<string, string | string[]>;

/**
 * Props that are passed to the page component OR API route handler by the router.
 * Specify the type of the params object based on the app router structure.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page#props} for more info
 */
export type TPageProps<TParams extends TSegments = TSegments> = {
  params: Promise<TParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional} for more info
 */
export type TApiParams<TParams extends TSegments> = Pick<
  TPageProps<TParams>,
  "params"
>;
