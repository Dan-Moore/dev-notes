export function makePath(root: string, slug: string) {
    return require("path").join(root, slug);
}