export interface Middleware {
  (text: string, $: any, node: any): string
}