# frozen_string_literal: true

# rubocop:disable Metrics/MethodLength, Metrics/AbcSize
module Support
  module MigrationHelpers
    def migrations_path
      ActiveRecord::Migrator.migrations_path
    end

    def all_migrations
      ActiveRecord::Migrator.migrations(migrations_path)
    end

    def reload_all_models
      ApplicationRecord.clear_cache!
      ApplicationRecord.descendants.each(&:reset_column_information)
    end

    def migration_version
      migration_name = described_class.to_s.underscore
      migration_name += '.rb' unless migration_name.end_with?('.rb')

      migration = all_migrations.detect do |m|
        m.filename.end_with?(migration_name)
      end
      migration.version
    end

    def newest_migration_version
      all_migrations.last.version
    end

    def reset_database_to_migration_version
      around do |spec|
        connection = ApplicationRecord.connection

        connection.drop_table(:schema_migrations)
        connection.tables.each { |table| connection.drop_table(table) }

        verbose_was = ActiveRecord::Migration.verbose
        ActiveRecord::Migration.verbose = false

        # Fix for 20170209165841_migrate_enrollment_data_to_localities_spec
        # The beta column is added to User in a later migration, but
        # the current running schema is cached with that column.
        # Causing:
        # PG::UndefinedColumn: ERROR:  column users.beta does not exist
        User.connection.schema_cache.clear!
        User.reset_column_information

        migrations_path = ActiveRecord::Migrator.migrations_path
        ActiveRecord::Migrator.migrate(migrations_path, self.class.migration_version)
        self.class.reload_all_models

        begin
          spec.run
        ensure
          ActiveRecord::Migrator.migrate(migrations_path)
          ActiveRecord::Migration.verbose = verbose_was
          self.class.reload_all_models
        end
      end
    end
  end
end
