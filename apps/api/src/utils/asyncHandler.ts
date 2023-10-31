import { NextFunction, RequestHandler } from "express"
import * as core from "express-serve-static-core"

export function asyncHandler<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
>(
  fn: (
    ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
  ) => void | Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return function asyncUtilWrap(...args) {
    const fnReturn = fn(...args)
    const next = args[args.length - 1] as NextFunction
    return Promise.resolve(fnReturn).catch(next)
  }
}
