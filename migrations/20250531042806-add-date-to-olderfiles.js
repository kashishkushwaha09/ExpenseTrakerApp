'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await Promise.all([
       queryInterface.addColumn('OlderFiles', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }),
     queryInterface.addColumn('OlderFiles', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    })
  ]);
   
  },
   
  

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([
         queryInterface.removeColumn('OlderFiles', 'createdAt'),
         queryInterface.removeColumn('OlderFiles', 'updatedAt')
      ]);
  }
};
