exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('Comments', function (table) {
    table.increments().primary()
    table.integer('post_id').references('post.id')
    table.date('date_posted')
    table.string('comment')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Comments')
}
