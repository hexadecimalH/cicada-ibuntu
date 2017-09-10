<?php

use Phinx\Migration\AbstractMigration;

class UserMigration extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-abstractmigration-class
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change()
    {
        $table = $this->table('users');
        $table->addColumn('oauth_provider', 'text', ['null' => true])
            ->addColumn('oauth_uid', 'text', ['null' => true])
            ->addColumn('first_name', 'text')
            ->addColumn('last_name', 'text')
            ->addColumn('email', 'string', ['limit' => 200])
            ->addColumn('password', 'string', ['limit' => 200])
            ->addColumn('link', 'text', ['null' => true])
            ->addColumn('type', 'enum', ['values' => ['student', 'professor']])
            ->addColumn('picture', 'text', ['null' => true])
            ->addColumn('university_id', 'integer')
            ->addForeignKey('university_id', 'university', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('faculty_id', 'integer')
            ->addForeignKey('faculty_id', 'faculty', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('department_id', 'integer')
            ->addForeignKey('department_id', 'department', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('bio', 'text', ['null' => true ])
            ->addColumn('created', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('modified', 'datetime', ['null' => true])
            ->addIndex('email', ['unique' => true])
            ->create();
    }
}
