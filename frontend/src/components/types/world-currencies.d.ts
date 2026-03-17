declare module "world-currencies" {
    const currencies: Record<string, {
        name: string
        iso: {
            code: string
            number: string
        }
        units: {
            major: {
                name: string
                symbol: string
            }
        }
    }>
    export default currencies
}