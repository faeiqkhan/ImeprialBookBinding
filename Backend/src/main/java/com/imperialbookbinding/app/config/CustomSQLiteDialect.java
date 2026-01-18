package com.imperialbookbinding.app.config;


import org.hibernate.dialect.DatabaseVersion;
import org.hibernate.community.dialect.SQLiteDialect;

public class CustomSQLiteDialect extends SQLiteDialect {

    public CustomSQLiteDialect() {
        super(DatabaseVersion.make(3, 45));
    }

    @Override
    public boolean dropConstraints() {
        return false;
    }

    @Override
    public boolean supportsIfExistsBeforeTableName() {
        return true;
    }
}
