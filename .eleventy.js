const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('fonts')
  eleventyConfig.addPassthroughCopy({ static: '/' })
  eleventyConfig.addPassthroughCopy({ 'posts/**/*.{png,gif}': '/images' })

  eleventyConfig.addFilter('formatDate', (date) => {
    if (!date) {
      return
    }
    const m = date.getMonth() + 1
    const month = m < 10 ? `0${m}` : m
    const year = date.getFullYear()
    return `${year}/${month}`
  })

  eleventyConfig.addFilter('removeExtension', (filename) => {
    return filename.split('.')[0]
  })
}
