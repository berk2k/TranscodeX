'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jobs', 'video_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.addColumn('jobs', 'started_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('jobs', 'finished_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('jobs', 'error_message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('jobs', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });


    await queryInterface.addColumn('jobs', 'status', {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('jobs', 'video_id');
    await queryInterface.removeColumn('jobs', 'started_at');
    await queryInterface.removeColumn('jobs', 'finished_at');
    await queryInterface.removeColumn('jobs', 'error_message');
    await queryInterface.removeColumn('jobs', 'updated_at');
    await queryInterface.removeColumn('jobs', 'status');


    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_status";');
  }
};
