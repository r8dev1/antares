const defaults = require('./defaults');

module.exports = {
   ...defaults,
   // Defaults
   defaultPort: 5432,
   defaultUser: 'postgres',
   defaultDatabase: 'postgres',
   // Core
   database: true,
   // Tools
   processesList: true,
   // Structure
   tables: true,
   views: true,
   triggers: true,
   triggerFunctions: true,
   routines: true,
   functions: true,
   // Settings
   elementsWrapper: '"',
   stringsWrapper: '\'',
   tableAdd: true,
   viewAdd: true,
   triggerAdd: true,
   triggerFunctionAdd: true,
   routineAdd: true,
   functionAdd: true,
   databaseEdit: false,
   tableSettings: true,
   viewSettings: true,
   triggerSettings: true,
   triggerFunctionSettings: true,
   routineSettings: true,
   functionSettings: true,
   indexes: true,
   foreigns: true,
   nullable: true,
   tableArray: true,
   procedureSql: '$procedure$\r\n\r\n$procedure$',
   procedureContext: true,
   procedureLanguage: true,
   functionSql: '$function$\r\n\r\n$function$',
   triggerFunctionSql: '$function$\r\nBEGIN\r\n\r\nEND\r\n$function$',
   triggerFunctionlanguages: ['plpgsql'],
   functionContext: true,
   functionLanguage: true,
   triggerSql: 'EXECUTE PROCEDURE ',
   triggerStatementInCreation: true,
   triggerMultipleEvents: true,
   triggerTableInName: true,
   triggerOnlyRename: false,
   languages: ['sql', 'plpgsql', 'c', 'internal']
};
