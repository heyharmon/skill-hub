#!/usr/bin/env python3
"""Example script demonstrating a skill's executable component."""

import json
import sys


def main():
    """Process input and return structured output."""
    input_data = sys.argv[1] if len(sys.argv) > 1 else "world"

    result = {
        "status": "success",
        "message": f"Hello, {input_data}!",
        "skill": "example-skill",
    }

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
