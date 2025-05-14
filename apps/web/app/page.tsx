import { bar } from "./foo"
import  Hi  from "../../markdown/posts/hi.mdx"

export default function Page() {

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
      <Hi />
      </div>
    </div>
  )
}
