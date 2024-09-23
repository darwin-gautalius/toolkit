export function isNotNull<T>(x: T): x is NonNullable<T> {
    return !!x;
}