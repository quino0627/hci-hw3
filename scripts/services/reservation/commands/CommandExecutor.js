class CommandExecutor {
  static async execute(command) {
    try {
      await command.execute();
    } catch (error) {
      console.error("커맨드 실행 오류:", error);
      throw error;
    }
  }
}

export default CommandExecutor;
