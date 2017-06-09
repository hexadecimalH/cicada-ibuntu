<?php

use Phinx\Migration\AbstractMigration;

class FacultyMigration extends AbstractMigration
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
        $table = $this->table('faculty');
        $table->addColumn('name', 'text')
            ->addColumn('university_id', 'integer')
            ->addForeignKey('university_id', 'university', 'id')
            ->addColumn('info', 'text', ['null' => true])
            ->addColumn('branch', 'text', ['null' => true])
            ->addColumn('created', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->create();
    }
}
