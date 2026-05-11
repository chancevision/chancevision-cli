#!/usr/bin/env node
import { Command } from "commander";
import { seeCommand } from "./commands/see";
import { version } from "../package.json";

const program = new Command();

program
  .name("chancevision")
  .description("Seamless visual intelligence for your command line")
  .version(version);

program.addCommand(seeCommand());

program.parse();
