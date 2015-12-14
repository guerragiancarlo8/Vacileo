class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
 
    	t.integer :score
      t.timestamps null: false
    end
  end
end
