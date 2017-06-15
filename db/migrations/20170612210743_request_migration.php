<?php

use Phinx\Migration\AbstractMigration;

class RequestMigration extends AbstractMigration
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
        $table = $this->table('course_requests');
        $table->addColumn('send_by_user_id', 'integer')
            ->addForeignKey('send_by_user_id', 'users', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('for_course_id', 'integer')
            ->addForeignKey('for_course_id', 'course', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('status', 'text')
            ->addColumn('created', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->create();
    }
}
