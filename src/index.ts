#!/usr/bin/env node
import { Command } from "commander";
import { seeCommand } from "./commands/see";

const program = new Command();

program
  .name("chancevision")
  .description("Seamless visual intelligence for your command line")
  .version("0.1.2");

program.addCommand(seeCommand());

program.parse();
