# logggggoff

[![npm version](https://img.shields.io/npm/v/logggggoff.svg)](https://www.npmjs.com/package/logggggoff)
[![npm downloads per week](https://img.shields.io/npm/dw/logggggoff.svg)](https://www.npmjs.com/package/logggggoff)

A colorful, cross-platform CLI tool designed to help you **list**, **understand**, and **log off** running processes, grouped into helpful categories.

Part of the **processLogger** tooling from [THE RISE COLLECTION](https://www.therisecollection.co/portfolio/processlogger).

## Features
- **Categorized process list**: Quickly see running processes grouped as Browser, Editor/IDE, Office, System, and Other.
- **Readable descriptions**: Common apps include a short description so you know what each process does at a glance.
- **Single-process shutdown**: Terminate a specific process by PID directly from the CLI.
- **Graceful shutdown**: Uses `SIGTERM` on Unix-like systems for a more graceful stop when possible.
- **Cross-platform**: Works on **Windows**, **macOS**, and **Linux**.

## Installation

```bash
npm install -g logggggoff
```

## Usage

After installing globally, use the `logggggoff` command in your terminal.

### List running processes

This is the default behavior when no subcommand is provided:

```bash
logggggoff
```

Or explicitly:

```bash
logggggoff list
```

You will see a categorized, color-coded list of running processes:

```text
Logggggoff Process List

Running Processes:
1. chrome (PID: 1234) - Google Chrome web browser. [Browser]
2. code (PID: 5678) - Visual Studio Code editor. [Editor/IDE]
...
```

### Kill a specific process by PID

To terminate a single process by its PID:

```bash
logggggoff 525 run
```

This will attempt to gracefully stop the process with PID `525` and print a success or error message.

> **Note**: Use this carefully. Always double-check the PID before terminating a process.

