<?php

use Phinx\Migration\AbstractMigration;

class CourseAndCourseSchedule extends AbstractMigration
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
        $table = $this->table('course');
        $table->addColumn('course_name', 'text')
            ->addColumn('department_id', 'integer')
            ->addForeignKey('department_id', 'department', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('professor_id', 'integer')
            ->addForeignKey('professor_id', 'users', 'id',[
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('semester', 'text')
            ->addColumn('info', 'text', ['null' => true])
            ->addColumn('year', 'integer')
            ->addColumn('created', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('modified', 'datetime', ['null' => true])
            ->create();

        $table = $this->table('course_schedule');
        $table->addColumn('day', 'text')
            ->addColumn('course_id', 'integer')
            ->addForeignKey('course_id', 'course', 'id', [
                'delete'=> 'CASCADE',
                'update'=> 'CASCADE'
            ])
            ->addColumn('duration', 'text')
            ->addColumn('created', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('modified', 'datetime', ['null' => true])
            ->create();
    }
}
