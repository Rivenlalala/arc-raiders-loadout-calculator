const GAME_DATA = {
  "version": "1.0.0",
  "last_updated": "2025-12-02",
  "weapons": [
    {
      "id": "kettle",
      "name": "Kettle",
      "category": "Unknown",
      "rarity": "Common",
      "ammo_type": "Light Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Light-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 6
            },
            {
              "material": "Rubber Parts",
              "quantity": 8
            }
          ],
          "workshop": "Gunsmith 1orWorkbench 1"
        },
        "upgrades": [
          {
            "to_tier": "Kettle II",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 8
              },
              {
                "material": "Plastic Parts",
                "quantity": 10
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Kettle III",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 10
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Kettle IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "rattler",
      "name": "Rattler",
      "category": "Unknown",
      "rarity": "Common",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 16
            },
            {
              "material": "Rubber Parts",
              "quantity": 12
            }
          ],
          "workshop": "Gunsmith 1"
        },
        "upgrades": [
          {
            "to_tier": "Rattler II",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Rattler III",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Rattler IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "arpeggio",
      "name": "Arpeggio",
      "category": "Unknown",
      "rarity": "Uncommon",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Medium-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Mechanical Components",
              "quantity": 6
            },
            {
              "material": "Simple Gun Parts",
              "quantity": 6
            }
          ],
          "workshop": "Gunsmith 2"
        },
        "upgrades": [
          {
            "to_tier": "Arpeggio II",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Arpeggio III",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 5
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Arpeggio IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 5
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "tempest",
      "name": "Tempest",
      "category": "Unknown",
      "rarity": "Epic",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Medium-Mag"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 1
            },
            {
              "material": "Medium Gun Parts",
              "quantity": 3
            },
            {
              "material": "Exodus Modules",
              "quantity": 2
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Tempest II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Tempest III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Tempest IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "bettina",
      "name": "Bettina",
      "category": "Unknown",
      "rarity": "Epic",
      "ammo_type": "Heavy Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Advanced Mechanical Components",
              "quantity": 3
            },
            {
              "material": "Heavy Gun Parts",
              "quantity": 3
            },
            {
              "material": "Canister",
              "quantity": 3
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Bettina II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 3"
          },
          {
            "to_tier": "Bettina III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 3"
          },
          {
            "to_tier": "Bettina IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 3"
          }
        ]
      }
    },
    {
      "id": "ferro",
      "name": "Ferro",
      "category": "Unknown",
      "rarity": "Common",
      "ammo_type": "Heavy Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 5
            },
            {
              "material": "Rubber Parts",
              "quantity": 2
            }
          ],
          "workshop": "Gunsmith 1"
        },
        "upgrades": [
          {
            "to_tier": "Ferro II",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 7
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Ferro III",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 9
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Ferro IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "renegade",
      "name": "Renegade",
      "category": "Unknown",
      "rarity": "Rare",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Medium-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Advanced Mechanical Components",
              "quantity": 2
            },
            {
              "material": "Medium Gun Parts",
              "quantity": 3
            },
            {
              "material": "Oil",
              "quantity": 5
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Renegade II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Renegade III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Renegade IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "aphelion",
      "name": "Aphelion",
      "category": "Unknown",
      "rarity": "Legendary",
      "ammo_type": "Energy Clip",
      "modification_slots": [
        "Underbarrel",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 3
            },
            {
              "material": "Complex Gun Parts",
              "quantity": 3
            },
            {
              "material": "Matriarch Reactor",
              "quantity": 1
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": []
      }
    },
    {
      "id": "stitcher",
      "name": "Stitcher",
      "category": "Unknown",
      "rarity": "Common",
      "ammo_type": "Light Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Light-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 8
            },
            {
              "material": "Rubber Parts",
              "quantity": 4
            }
          ],
          "workshop": "Gunsmith 1orWorkbench 1"
        },
        "upgrades": [
          {
            "to_tier": "Stitcher II",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 8
              },
              {
                "material": "Rubber Parts",
                "quantity": 12
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Stitcher III",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 10
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Stitcher IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "bobcat",
      "name": "Bobcat",
      "category": "Unknown",
      "rarity": "Epic",
      "ammo_type": "Light Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Light-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 1
            },
            {
              "material": "Light Gun Parts",
              "quantity": 3
            },
            {
              "material": "Exodus Modules",
              "quantity": 2
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Bobcat II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Light Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Bobcat III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Light Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Bobcat IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Light Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "il_toro",
      "name": "Il Toro",
      "category": "Unknown",
      "rarity": "Uncommon",
      "ammo_type": "Shotgun Ammo",
      "modification_slots": [
        "Shotgun-Muzzle",
        "Underbarrel",
        "Shotgun-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Mechanical Components",
              "quantity": 5
            },
            {
              "material": "Simple Gun Parts",
              "quantity": 6
            }
          ],
          "workshop": "Gunsmith 1"
        },
        "upgrades": [
          {
            "to_tier": "Il Toro II",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Il Toro III",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Il Toro IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "vulcano",
      "name": "Vulcano",
      "category": "Unknown",
      "rarity": "Epic",
      "ammo_type": "Shotgun Ammo",
      "modification_slots": [
        "Shotgun-Muzzle",
        "Underbarrel",
        "Shotgun-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 1
            },
            {
              "material": "Heavy Gun Parts",
              "quantity": 3
            },
            {
              "material": "Exodus Modules",
              "quantity": 1
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Vulcano II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Vulcano III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Vulcano IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "hairpin",
      "name": "Hairpin",
      "category": "Unknown",
      "rarity": "Common",
      "ammo_type": "Light Ammo",
      "modification_slots": [
        "Light-Mag"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 2
            },
            {
              "material": "Plastic Parts",
              "quantity": 5
            }
          ],
          "workshop": "Gunsmith 1orWorkbench 1"
        },
        "upgrades": [
          {
            "to_tier": "Hairpin II",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 8
              }
            ],
            "workshop": "Gunmsith 1"
          },
          {
            "to_tier": "Hairpin III",
            "materials": [
              {
                "material": "Metal Parts",
                "quantity": 6
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Hairpin IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "burletta",
      "name": "Burletta",
      "category": "Unknown",
      "rarity": "Uncommon",
      "ammo_type": "Light Ammo",
      "modification_slots": [
        "Muzzle",
        "Light-Mag"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Mechanical Components",
              "quantity": 3
            },
            {
              "material": "Simple Gun Parts",
              "quantity": 3
            }
          ],
          "workshop": "Gunsmith 1"
        },
        "upgrades": [
          {
            "to_tier": "Burletta II",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Burletta III",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Burletta IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Light Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "anvil",
      "name": "Anvil",
      "category": "Unknown",
      "rarity": "Uncommon",
      "ammo_type": "Heavy Ammo",
      "modification_slots": [
        "Muzzle",
        "Tech-Mod"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Mechanical Components",
              "quantity": 5
            },
            {
              "material": "Simple Gun Parts",
              "quantity": 6
            }
          ],
          "workshop": "Gunsmith 1"
        },
        "upgrades": [
          {
            "to_tier": "Anvil II",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 3
              },
              {
                "material": "Simple Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Anvil III",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Anvil IV",
            "materials": [
              {
                "material": "Mechanical Components",
                "quantity": 4
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "venator",
      "name": "Venator",
      "category": "Unknown",
      "rarity": "Rare",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Underbarrel",
        "Medium-Mag"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Advanced Mechanical Components",
              "quantity": 2
            },
            {
              "material": "Medium Gun Parts",
              "quantity": 3
            },
            {
              "material": "Magnet",
              "quantity": 5
            }
          ],
          "workshop": "Gunsmith 2"
        },
        "upgrades": [
          {
            "to_tier": "Venator II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Venator III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Venator IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "torrente",
      "name": "Torrente",
      "category": "Unknown",
      "rarity": "Rare",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Medium-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Advanced Mechanical Components",
              "quantity": 2
            },
            {
              "material": "Medium Gun Parts",
              "quantity": 3
            },
            {
              "material": "Steel Spring",
              "quantity": 6
            }
          ],
          "workshop": "Gunsmith 2"
        },
        "upgrades": [
          {
            "to_tier": "Torrente II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Torrente III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Torrente IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "osprey",
      "name": "Osprey",
      "category": "Unknown",
      "rarity": "Rare",
      "ammo_type": "Medium Ammo",
      "modification_slots": [
        "Muzzle",
        "Underbarrel",
        "Medium-Mag",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Advanced Mechanical Components",
              "quantity": 2
            },
            {
              "material": "Medium Gun Parts",
              "quantity": 3
            },
            {
              "material": "Wires",
              "quantity": 7
            }
          ],
          "workshop": "Gunsmith 2"
        },
        "upgrades": [
          {
            "to_tier": "Osprey II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Osprey III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          },
          {
            "to_tier": "Osprey IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Medium Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 1"
          }
        ]
      }
    },
    {
      "id": "jupiter",
      "name": "Jupiter",
      "category": "Unknown",
      "rarity": "Legendary",
      "ammo_type": "Energy Clip",
      "modification_slots": [],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 3
            },
            {
              "material": "Complex Gun Parts",
              "quantity": 3
            },
            {
              "material": "Queen Reactor",
              "quantity": 1
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": []
      }
    },
    {
      "id": "hullcracker",
      "name": "Hullcracker",
      "category": "Unknown",
      "rarity": "Epic",
      "ammo_type": null,
      "modification_slots": [
        "Underbarrel",
        "Stock"
      ],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 1
            },
            {
              "material": "Heavy Gun Parts",
              "quantity": 3
            },
            {
              "material": "Exodus Modules",
              "quantity": 1
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": [
          {
            "to_tier": "Hullcracker II",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 1
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 2
              }
            ],
            "workshop": "Gunsmith 2"
          },
          {
            "to_tier": "Hullcracker III",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 1
              }
            ],
            "workshop": "Gunsmith 2"
          },
          {
            "to_tier": "Hullcracker IV",
            "materials": [
              {
                "material": "Advanced Mechanical Components",
                "quantity": 2
              },
              {
                "material": "Heavy Gun Parts",
                "quantity": 3
              }
            ],
            "workshop": "Gunsmith 2"
          }
        ]
      }
    },
    {
      "id": "equalizer",
      "name": "Equalizer",
      "category": "Unknown",
      "rarity": "Legendary",
      "ammo_type": "Energy Clip",
      "modification_slots": [],
      "crafting": {
        "tier1": {
          "materials": [
            {
              "material": "Magnetic Accelerator",
              "quantity": 3
            },
            {
              "material": "Complex Gun Parts",
              "quantity": 3
            },
            {
              "material": "Queen Reactor",
              "quantity": 1
            }
          ],
          "workshop": "Gunsmith 3"
        },
        "upgrades": []
      }
    }
  ],
  "equipment": {
    "augments": [
      {
        "id": "free_loadout_augment",
        "name": "Free Loadout Augment",
        "category": "augments",
        "rarity": "Common",
        "description": "Basic augment for rookie Raiders, offering slightly more backpack space and carry capacity.",
        "stats": {
          "Backpack Slots": "14",
          "Safe Pocket Slots": "0",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Weight Limit": "35.0",
          "Shield Compatibility": "Light",
          "Weight": "1.0",
          "Sell Price": "100"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "looting_mk._1",
        "name": "Looting Mk. 1",
        "category": "augments",
        "rarity": "Uncommon",
        "description": "Basic looting augment. More backpack slots and weight capacity, but low defensive and tactical capability.",
        "stats": {
          "Backpack Slots": "18",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Weight Limit": "50.0",
          "Shield Compatibility": "Light",
          "Weight": "1.0",
          "Sell Price": "640"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rubber Parts",
              "quantity": 6
            },
            {
              "material": "Plastic Parts",
              "quantity": 6
            }
          ],
          "workshop": "Workbench 1OrGear Bench 1"
        }
      },
      {
        "id": "combat_mk._1",
        "name": "Combat Mk. 1",
        "category": "augments",
        "rarity": "Uncommon",
        "description": "Basic combat augment. Supports stronger shields, but with limited backpack capacity and Quick Use slots.",
        "stats": {
          "Backpack Slots": "16",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Weight Limit": "45.0",
          "Shield Compatibility": "Light, Medium",
          "Weight": "2.0",
          "Sell Price": "640"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rubber Parts",
              "quantity": 6
            },
            {
              "material": "Plastic Parts",
              "quantity": 6
            }
          ],
          "workshop": "Gear Bench 1"
        }
      },
      {
        "id": "tactical_mk._1",
        "name": "Tactical Mk. 1",
        "category": "augments",
        "rarity": "Uncommon",
        "description": "Basic tactical augment. More Quick Use slots for more tactical choice, but limited survivability and slightly lower looting potential.",
        "stats": {
          "Backpack Slots": "15",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Weight Limit": "40.0",
          "Shield Compatibility": "Light, Medium",
          "Weight": "2.0",
          "Sell Price": "640"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rubber Parts",
              "quantity": 6
            },
            {
              "material": "Plastic Parts",
              "quantity": 6
            }
          ],
          "workshop": "Gear Bench 1"
        }
      },
      {
        "id": "looting_mk._2",
        "name": "Looting Mk. 2",
        "category": "augments",
        "rarity": "Rare",
        "description": "Significantly increases looting potential; adds slots for trinkets.",
        "stats": {
          "Backpack Slots": "22",
          "Safe Pocket Slots": "2",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Trinket Slots": "3",
          "Weight Limit": "60.0",
          "Shield Compatibility": "Light",
          "Weight": "2.0",
          "Sell Price": "2,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 2
            },
            {
              "material": "Magnet",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 2"
        }
      },
      {
        "id": "combat_mk._2",
        "name": "Combat Mk. 2",
        "category": "augments",
        "rarity": "Rare",
        "description": "A combat augment more focused on maneuverability than absorbing damage.",
        "stats": {
          "Backpack Slots": "18",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Grenade Use Slots": "1",
          "Weight Limit": "55.0",
          "Shield Compatibility": "Light, Medium, Heavy",
          "Weight": "3.0",
          "Sell Price": "2,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 2
            },
            {
              "material": "Magnet",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 2"
        }
      },
      {
        "id": "tactical_mk._2",
        "name": "Tactical Mk. 2",
        "category": "augments",
        "rarity": "Rare",
        "description": "Adds more backpack space and an extra utility item slot.",
        "stats": {
          "Backpack Slots": "17",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Deployable Utility Slots": "1",
          "Weight Limit": "45.0",
          "Shield Compatibility": "Light, Medium",
          "Weight": "2.0",
          "Sell Price": "2,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 2
            },
            {
              "material": "Magnet",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 2"
        }
      },
      {
        "id": "looting_mk._3_(cautious)",
        "name": "Looting Mk. 3 (Cautious)",
        "category": "augments",
        "rarity": "Epic",
        "description": "A looting augment that swaps some carry capacity to increase survivability.",
        "stats": {
          "Backpack Slots": "24",
          "Safe Pocket Slots": "2",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Weight Limit": "70.0",
          "Shield Compatibility": "Light",
          "Weight": "3",
          "Sell Price": "5000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 3"
        }
      },
      {
        "id": "integrated_binoculars",
        "name": "Integrated Binoculars",
        "category": "augments",
        "rarity": "Common",
        "description": "Can be equipped and used like regular binoculars, but cannot be dropped or removed from their slot.",
        "stats": {
          "Weight": "0.5"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "looting_mk._3_(survivor)",
        "name": "Looting Mk. 3 (Survivor)",
        "category": "augments",
        "rarity": "Epic",
        "description": "A heavy-duty pack mule augment. Large weight capacity and large backpack space.",
        "stats": {
          "Backpack Slots": "20",
          "Safe Pocket Slots": "3",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Deployable Utility Slots": "1",
          "Weight Limit": "80.0",
          "Shield Compatibility": "Light, Medium",
          "Weight": "4.0",
          "Sell Price": "5,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 3"
        }
      },
      {
        "id": "combat_mk._3_(aggressive)",
        "name": "Combat Mk. 3 (Aggressive)",
        "category": "augments",
        "rarity": "Epic",
        "description": "An improved version of the Combat II augment. Supports more shield types, and comes with extra space for grenades.",
        "stats": {
          "Backpack Slots": "18",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "4",
          "Weapon Slots": "2",
          "Grenade Use Slots": "2",
          "Weight Limit": "65.0",
          "Shield Compatibility": "Light, Medium, Heavy",
          "Weight": "5.0",
          "Sell Price": "5,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 3"
        }
      },
      {
        "id": "combat_mk._3_(flanking)",
        "name": "Combat Mk. 3 (Flanking)",
        "category": "augments",
        "rarity": "Epic",
        "description": "A combat augment more focused on manueverability than absorbing damage.",
        "stats": {
          "Backpack Slots": "20",
          "Safe Pocket Slots": "2",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Deployable Utility Slots": "3",
          "Weight Limit": "60.0",
          "Shield Compatibility": "Light Shield",
          "Weight": "3",
          "Sell Price": "3,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 3"
        }
      },
      {
        "id": "tactical_mk._3_(defensive)",
        "name": "Tactical Mk. 3 (Defensive)",
        "category": "augments",
        "rarity": "Epic",
        "description": "A defensive-focused augment for keeping Shields topped up.",
        "stats": {
          "Backpack Slots": "20",
          "Safe Pocket Slots": "1",
          "Quick Use Slots": "5",
          "Weapon Slots": "2",
          "Weight Limit": "60.0",
          "Shield Compatibility": "Light,Medium,Heavy",
          "Weight": "5.0",
          "Sell Price": "5,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 3
            }
          ],
          "workshop": "Gear Bench 3"
        }
      },
      {
        "id": "integrated_shield_recharger",
        "name": "Integrated Shield Recharger",
        "category": "augments",
        "rarity": "Common",
        "description": "Reusable Shield Recharger on a fixed cooldown. Can be used like a normal Shield Charger, but cannot be dropped or removed from its slot.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "1",
          "Use Time": "5s",
          "Recharge": "50"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      }
    ],
    "shields": [
      {
        "id": "light_shield",
        "name": "Light Shield",
        "category": "shields",
        "rarity": "Uncommon",
        "description": "A lightweight shield that offers limited protection without severely impacting mobility.",
        "stats": {
          "Shield Charge": "40",
          "Damage Mitigation": "40%",
          "Weight": "5.0",
          "Sell Price": "640"
        },
        "crafting": {
          "materials": [
            {
              "material": "ARC Alloy",
              "quantity": 2
            },
            {
              "material": "Plastic Parts",
              "quantity": 4
            }
          ],
          "workshop": "Workbench I"
        }
      },
      {
        "id": "medium_shield",
        "name": "Medium Shield",
        "category": "shields",
        "rarity": "Rare",
        "description": "A standard shield that offers fair protection at a moderate cost to mobility.",
        "stats": {
          "Shield Charge": "70",
          "Damage Mitigation": "42.5%",
          "Movement Penalty": "5%",
          "Weight": "7.0",
          "Sell Price": "2,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Battery",
              "quantity": 4
            },
            {
              "material": "ARC Circuitry",
              "quantity": 1
            }
          ],
          "workshop": "Gear Bench 2"
        }
      },
      {
        "id": "heavy_shield",
        "name": "Heavy Shield",
        "category": "shields",
        "rarity": "Epic",
        "description": "A heavy shield that blocks a large portion of incoming damage, but carries a significant cost to mobility.",
        "stats": {
          "Shield Charge": "80",
          "Damage Mitigation": "52.5%",
          "Movement Penalty": "15%",
          "Weight": "9.0",
          "Sell Price": "5,500"
        },
        "crafting": {
          "materials": [
            {
              "material": "Power Rod",
              "quantity": 1
            },
            {
              "material": "Voltage Converter",
              "quantity": 2
            }
          ],
          "workshop": "Gear Bench 2"
        }
      }
    ],
    "healing": [
      {
        "id": "agave",
        "name": "Agave",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "A piece of an agave leaf. Can be used to regain a small amount of health.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "1,000",
          "Healing": "1/s",
          "Use Time": "1s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Agave",
              "quantity": 1
            },
            {
              "material": "Empty Wine Bottle",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "bandage",
        "name": "Bandage",
        "category": "healing",
        "rarity": "Common",
        "description": "A medical item that gradually restores health over time.",
        "stats": {
          "Weight": "0.1",
          "Stack Size": "5",
          "Sell Price": "250",
          "Healing": "2/s",
          "Use Time": "1.5s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Fabric",
              "quantity": 5
            }
          ],
          "workshop": "Medical Lab 1OrWorkbench 1"
        }
      },
      {
        "id": "defibrillator",
        "name": "Defibrillator",
        "category": "healing",
        "rarity": "Rare",
        "description": "An injection that quickly revived downed raiders and restores some health.",
        "stats": {
          "Weight": "0.75",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Healing": "50",
          "Use Time": "1.5s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Plastic Parts",
              "quantity": 9
            },
            {
              "material": "Moss",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 2"
        }
      },
      {
        "id": "expired_pasta",
        "name": "Expired Pasta",
        "category": "healing",
        "rarity": "Common",
        "description": "Way pasta its prime.",
        "stats": {
          "Can Be Found In": "CommercialResidential",
          "Weight": "0.1",
          "Stack Size": "15",
          "Sell Price": "1,000",
          "Healing": "15",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "fabric",
        "name": "Fabric",
        "category": "healing",
        "rarity": "Common",
        "description": "Used to craft medical supplies and shields.",
        "stats": {
          "Can Be Found In": "CommercialResidentialMedical",
          "Weight": "0.1",
          "Stack Size": "50",
          "Sell Price": "50",
          "Healing": "0.4/s",
          "Use Time": "1s",
          "Duration": "25s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Fabric",
              "quantity": 5
            }
          ],
          "workshop": "Medical Lab 1orWorkbench"
        }
      },
      {
        "id": "fruit_mix",
        "name": "Fruit Mix",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "A food item that moderately increases both health and stamina.",
        "stats": {
          "Weight": "0.3",
          "Stack Size": "5",
          "Sell Price": "1800",
          "Healing": "25",
          "Stamina": "50",
          "Use Time": "2s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Lemon",
              "quantity": 1
            },
            {
              "material": "Apricot",
              "quantity": 1
            },
            {
              "material": "Prickly Pear",
              "quantity": 1
            }
          ],
          "workshop": "Inventory"
        }
      },
      {
        "id": "herbal_bandage",
        "name": "Herbal Bandage",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "An improvised medical item that gradually restores health over time.",
        "stats": {
          "Weight": "0.15",
          "Stack Size": "5",
          "Sell Price": "640",
          "Healing": "3.5/s",
          "Use Time": "1.5s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Durable Cloth",
              "quantity": 1
            },
            {
              "material": "Great Mullein",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 2"
        }
      },
      {
        "id": "moss",
        "name": "Moss",
        "category": "healing",
        "rarity": "Rare",
        "description": "Can be used to regain a small amount of health.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.3",
          "Stack Size": "10",
          "Sell Price": "500",
          "Healing": "1/s",
          "Use Time": "1s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Plastic Parts",
              "quantity": 9
            },
            {
              "material": "Moss",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 2"
        }
      },
      {
        "id": "mushroom",
        "name": "Mushroom",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "Can be consumed to regain a small amount of health.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "1000",
          "Healing": "15",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Mushroom",
              "quantity": 12
            },
            {
              "material": "Apricot",
              "quantity": 12
            },
            {
              "material": "Very Comfortable Pillow",
              "quantity": 3
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "resin",
        "name": "Resin",
        "category": "healing",
        "rarity": "Common",
        "description": "Can be used to gradually restore a small amount of health over time.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.4",
          "Stack Size": "10",
          "Sell Price": "1,000",
          "Healing": "1/s",
          "Use Time": "1s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "sterilized_bandage",
        "name": "Sterilized Bandage",
        "category": "healing",
        "rarity": "Rare",
        "description": "A medical item that gradually restores a large amount of health over time.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "2000",
          "Healing": "5/s",
          "Use Time": "1.5s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Durable Cloth",
              "quantity": 2
            },
            {
              "material": "Antiseptic",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 2"
        }
      },
      {
        "id": "vita_shot",
        "name": "Vita Shot",
        "category": "healing",
        "rarity": "Rare",
        "description": "A medical item that restores a large amount of health.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "2,200",
          "Healing": "50",
          "Use Time": "4s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Antiseptic",
              "quantity": 1
            },
            {
              "material": "Syringe",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 3"
        }
      },
      {
        "id": "vita_spray",
        "name": "Vita Spray",
        "category": "healing",
        "rarity": "Epic",
        "description": "A medical item that continuously restores health during use. Can be used on yourself or your allies.",
        "stats": {
          "Weight": "1.0",
          "Stack Size": "1",
          "Sell Price": "3,000",
          "Healing": "10/s",
          "Heal Capacity": "150"
        },
        "crafting": {
          "materials": [
            {
              "material": "Antiseptic",
              "quantity": 3
            },
            {
              "material": "Canister",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 3"
        }
      },
      {
        "id": "arc_powercell",
        "name": "ARC Powercell",
        "category": "healing",
        "rarity": "Common",
        "description": "Valuable resource that drops from all ARC enemies.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "0.5",
          "Stack Size": "5",
          "Sell Price": "270",
          "Shield": "20",
          "Use Time": "3s",
          "Duration": "10s",
          "Recharge": "2/s"
        },
        "crafting": {
          "materials": [
            {
              "material": "ARC Powercell",
              "quantity": 1
            },
            {
              "material": "Rubber Parts",
              "quantity": 5
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "integrated_shield_recharger",
        "name": "Integrated Shield Recharger",
        "category": "healing",
        "rarity": "Common",
        "description": "Reusable Shield Recharger on a fixed cooldown. Can be used like a normal Shield Charger, but cannot be dropped or removed from its slot.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "1",
          "Use Time": "5s",
          "Recharge": "50"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "shield_recharger",
        "name": "Shield Recharger",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "A handheld repair kit that recharges a shield over time.",
        "stats": {
          "Weight": "0.15",
          "Stack Size": "5",
          "Sell Price": "520",
          "Shield": "50",
          "Use Time": "2s",
          "Duration": "10s",
          "Recharge": "4/s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rubber Parts",
              "quantity": 5
            },
            {
              "material": "ARC Powercell",
              "quantity": 1
            }
          ],
          "workshop": "Workbench I"
        }
      },
      {
        "id": "surge_shield_recharger",
        "name": "Surge Shield Recharger",
        "category": "healing",
        "rarity": "Rare",
        "description": "A handheld kit that recharges a shield on use.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "1200",
          "Use Time": "5s",
          "Recharge": "50"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 1
            },
            {
              "material": "Advanced ARC Powercell",
              "quantity": 1
            }
          ],
          "workshop": "Medical Lab 2"
        }
      },
      {
        "id": "adrenaline_shot",
        "name": "Adrenaline Shot",
        "category": "healing",
        "rarity": "Common",
        "description": "A serum that fully restores stamina and temporarily increases stamina regeneration.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "300",
          "Stamina": "5/s",
          "Use Time": "1s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 3
            },
            {
              "material": "Plastic Parts",
              "quantity": 3
            }
          ],
          "workshop": "Medical Lab 1"
        }
      },
      {
        "id": "agave_juice",
        "name": "Agave Juice",
        "category": "healing",
        "rarity": "Common",
        "description": "A concoction that temporarily increases stamina regeneration, at a small initial cost to health.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "1,800",
          "Stamina": "5/s",
          "Damage": "5",
          "Use Time": "1s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Agave",
              "quantity": 1
            },
            {
              "material": "Empty Wine Bottle",
              "quantity": 1
            }
          ],
          "workshop": "Inventory"
        }
      },
      {
        "id": "apricot",
        "name": "Apricot",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "A sun ripe apricot. Can be consumed for a small amount of stamina.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "640",
          "Stamina": "20",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Lemon",
              "quantity": 1
            },
            {
              "material": "Apricot",
              "quantity": 1
            },
            {
              "material": "Prickly Pear",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "bloated_tuna_can",
        "name": "Bloated Tuna Can",
        "category": "healing",
        "rarity": "Common",
        "description": "Something tells you that you don't want to open this...",
        "stats": {
          "Can Be Found In": "CommercialResidential",
          "Weight": "0.2",
          "Stack Size": "15",
          "Sell Price": "1,000",
          "Stamina": "25",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "lemon",
        "name": "Lemon",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "Can be consumed for a small amount of stamina.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "640",
          "Stamina": "20",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Lemon",
              "quantity": 1
            },
            {
              "material": "Apricot",
              "quantity": 1
            },
            {
              "material": "Prickly Pear",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "olives",
        "name": "Olives",
        "category": "healing",
        "rarity": "Uncommon",
        "description": "Can be consumed for a small amount of stamina.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "640",
          "Stamina": "20",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Prickly Pear",
              "quantity": 6
            },
            {
              "material": "Olives",
              "quantity": 6
            },
            {
              "material": "Cat Bed",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "prickly_pear",
        "name": "Prickly Pear",
        "category": "healing",
        "rarity": "Common",
        "description": "Can be consumed for a small amount of stamina.",
        "stats": {
          "Can Be Found In": "Nature",
          "Weight": "0.2",
          "Stack Size": "10",
          "Sell Price": "640",
          "Stamina": "20",
          "Use Time": "1s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Lemon",
              "quantity": 1
            },
            {
              "material": "Apricot",
              "quantity": 1
            },
            {
              "material": "Prickly Pear",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      }
    ],
    "quick_use": [
      {
        "id": "barricade_kit",
        "name": "Barricade Kit",
        "category": "quick_use",
        "rarity": "Uncommon",
        "description": "A deployable cover that can block incoming damage until it breaks.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "640",
          "Duration": "500 Health"
        },
        "crafting": {
          "materials": [
            {
              "material": "Mechanical Components",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "door_blocker",
        "name": "Door Blocker",
        "category": "quick_use",
        "rarity": "Common",
        "description": "A locking mechanism that can be placed on large metal doors to limit access.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "270"
        },
        "crafting": {
          "materials": [
            {
              "material": "Metal Parts",
              "quantity": 3
            },
            {
              "material": "Rubber Parts",
              "quantity": 3
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "remote_raider_flare",
        "name": "Remote Raider Flare",
        "category": "quick_use",
        "rarity": "Common",
        "description": "A deployable device that, when manually triggered, launches a Raider Distress Flare.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "270"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 2
            },
            {
              "material": "Rubber Parts",
              "quantity": 4
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "zipline",
        "name": "Zipline",
        "category": "quick_use",
        "rarity": "Rare",
        "description": "A deployable zipline that allows you to quickly move between two locations.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Range": "60m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rope",
              "quantity": 1
            },
            {
              "material": "Mechanical Components",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 2"
        }
      },
      {
        "id": "binoculars",
        "name": "Binoculars",
        "category": "quick_use",
        "rarity": "Common",
        "description": "A basic pair of binoculars with two levels of magnification.",
        "stats": {
          "Weight": "0.5",
          "Stack Size": "1",
          "Sell Price": "640"
        },
        "crafting": {
          "materials": [
            {
              "material": "Plastic Parts",
              "quantity": 8
            },
            {
              "material": "Rubber Parts",
              "quantity": 4
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "flame_spray",
        "name": "Flame Spray",
        "category": "quick_use",
        "rarity": "Uncommon",
        "description": "A classic makeshift weapon, sure to leave scorch marks.",
        "stats": {
          "Weight": "1",
          "Stack Size": "1",
          "Sell Price": "2000",
          "Damage": "10/s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Air Freshener",
              "quantity": 1
            },
            {
              "material": "Fireball Burner",
              "quantity": 1
            }
          ],
          "workshop": "Inventory"
        }
      },
      {
        "id": "integrated_binoculars",
        "name": "Integrated Binoculars",
        "category": "quick_use",
        "rarity": "Common",
        "description": "Can be equipped and used like regular binoculars, but cannot be dropped or removed from their slot.",
        "stats": {
          "Weight": "0.5"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "noisemaker",
        "name": "Noisemaker",
        "category": "quick_use",
        "rarity": "Common",
        "description": "A deployable proximity sensor that sounds an alarm when enemy raiders are detected.",
        "stats": {
          "Weight": "0.3",
          "Stack Size": "3",
          "Sell Price": "640",
          "Duration": "4s",
          "Radius": "8m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Speaker Component",
              "quantity": 1
            },
            {
              "material": "Plastic Parts",
              "quantity": 2
            }
          ],
          "workshop": "Inventory"
        }
      },
      {
        "id": "photoelectric_cloak",
        "name": "Photoelectric Cloak",
        "category": "quick_use",
        "rarity": "Epic",
        "description": "A gadget that allows the user to conceal themselves from ARC.",
        "stats": {
          "Weight": "1.0",
          "Stack Size": "1",
          "Sell Price": "5,000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 2
            },
            {
              "material": "Speaker Component",
              "quantity": 4
            }
          ],
          "workshop": "Utility Station 3"
        }
      },
      {
        "id": "recorder",
        "name": "Recorder",
        "category": "quick_use",
        "rarity": "Uncommon",
        "description": "A playable recorder used to attract ARC's attention, and impress other Raiders.",
        "stats": {
          "Can Be Found In": "Residential",
          "Weight": "0.2",
          "Stack Size": "1",
          "Sell Price": "1,000"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "snap_hook",
        "name": "Snap Hook",
        "category": "quick_use",
        "rarity": "Legendary",
        "description": "A gadget that allows the user to scale structures and cover large distances.",
        "stats": {
          "Weight": "5.0",
          "Stack Size": "1",
          "Sell Price": "14000",
          "Range": "20m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Power Rod",
              "quantity": 2
            },
            {
              "material": "Rope",
              "quantity": 3
            },
            {
              "material": "Exodus Modules",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 3"
        }
      }
    ],
    "grenades": [
      {
        "id": "smoke_grenade",
        "name": "Smoke Grenade",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that creates a lingering smoke cloud on impact, blocking visibility from other Raiders.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "1,000",
          "Duration": "20s",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 7
            },
            {
              "material": "Canister",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 1orWorkbench"
        }
      },
      {
        "id": "lure_grenade",
        "name": "Lure Grenade",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "A noise device that sticks to surfaces, distracting nearby ARC machines and drawing their fire.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Duration": "15s",
          "Radius": "50m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Speaker Component",
              "quantity": 1
            },
            {
              "material": "Electrical Components",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 2"
        }
      },
      {
        "id": "light_stick",
        "name": "Light Stick",
        "category": "grenades",
        "rarity": "Common",
        "description": "A throwable chemical light that illuminates the area around it.",
        "stats": {
          "Weight": "0.15",
          "Stack Size": "5",
          "Sell Price": "150",
          "Duration": "40s",
          "Radius": "7m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 3
            }
          ],
          "workshop": "Utility Station 2"
        }
      },
      {
        "id": "light_impact_grenade",
        "name": "Light Impact Grenade",
        "category": "grenades",
        "rarity": "Common",
        "description": "A grenade that detonates on impact, dealing explosive damage in a small radius.",
        "stats": {
          "Weight": "0.1",
          "Stack Size": "5",
          "Sell Price": "270",
          "Damage": "30",
          "Radius": "2.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Plastic Parts",
              "quantity": 1
            },
            {
              "material": "Chemicals",
              "quantity": 3
            }
          ],
          "workshop": "Explosives Station 1OrWorkbench"
        }
      },
      {
        "id": "heavy_fuze_grenade",
        "name": "Heavy Fuze Grenade",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that detonates after a delay, dealing explosive damage in its radius.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "1600",
          "Damage": "80",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Explosive Compound",
              "quantity": 1
            },
            {
              "material": "Canister",
              "quantity": 2
            }
          ],
          "workshop": "Explosives Station 3"
        }
      },
      {
        "id": "blaze_grenade",
        "name": "Blaze Grenade",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that detonates on impact, covering an area in fire that deals damage over time.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "1,600",
          "Damage": "5/s",
          "Duration": "10s",
          "Radius": "10m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Explosive Compound",
              "quantity": 1
            },
            {
              "material": "Oil",
              "quantity": 2
            }
          ],
          "workshop": "Explosives Station 3"
        }
      },
      {
        "id": "gas_grenade",
        "name": "Gas Grenade",
        "category": "grenades",
        "rarity": "Common",
        "description": "A grenade that creates a lingering toxic cloud on impact, draining the stamina of any Raiders within its area of effect.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "270",
          "Stamina": "-25/s",
          "Duration": "20s",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 4
            },
            {
              "material": "Rubber Parts",
              "quantity": 2
            }
          ],
          "workshop": "Explosives Station 1"
        }
      },
      {
        "id": "showstopper",
        "name": "Showstopper",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that detonates after a delay, stunning enemies within its radius.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "5",
          "Sell Price": "2,200",
          "ARC Stun": "10s",
          "Raider Stun": "2s",
          "Radius": "6m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Advanced Electrical Components",
              "quantity": 1
            },
            {
              "material": "Voltage Converter",
              "quantity": 1
            }
          ],
          "workshop": "Explosives Station 3"
        }
      },
      {
        "id": "snap_blast_grenade",
        "name": "Snap Blast Grenade",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "A grenade that sticks to surfaces, dealing explosive damage after a short delay.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "800",
          "Damage": "70",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Crude Explosives",
              "quantity": 2
            },
            {
              "material": "Magnet",
              "quantity": 1
            }
          ],
          "workshop": "Explosives Station 2"
        }
      },
      {
        "id": "seeker_grenade",
        "name": "Seeker Grenade",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "A homing grenade that targets a single nearby ARC dealing explosive damage on impact.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "5",
          "Sell Price": "640",
          "Damage": "50",
          "Homing Range": "20m"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "shrapnel_grenade",
        "name": "Shrapnel Grenade",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "A makeshift fuze grenade that bursts into razor-sharp fragments upon detonation.",
        "stats": {
          "Weight": "0.15",
          "Stack Size": "5",
          "Sell Price": "800",
          "Damage": "60",
          "Radius": "6m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Crude Explosives",
              "quantity": 1
            },
            {
              "material": "Steel Spring",
              "quantity": 2
            }
          ],
          "workshop": "Explosive Station 2"
        }
      },
      {
        "id": "trigger_'nade",
        "name": "Trigger 'Nade",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A remote-detonated grenade that can stick to surfaces and ARC, dealing explosive damage when triggered.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Damage": "90",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Crude Explosives",
              "quantity": 2
            },
            {
              "material": "Processor",
              "quantity": 1
            }
          ],
          "workshop": "Explosives Station 2"
        }
      },
      {
        "id": "trailblazer",
        "name": "Trailblazer",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that emits a trail of flammable gas along its path, causing an explosive chain reaction when it ignites.",
        "stats": {
          "Weight": "1.0",
          "Stack Size": "3",
          "Sell Price": "1,600",
          "Damage": "20",
          "Radius": "2m"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "wolfpack",
        "name": "Wolfpack",
        "category": "grenades",
        "rarity": "Epic",
        "description": "A grenade that scatters into multiple homing missiles, each one targeting ARC and dealing explosive damage on impact.",
        "stats": {
          "Weight": "1.0",
          "Stack Size": "1",
          "Sell Price": "5,000",
          "Damage": "166x12",
          "Radius": "100m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Explosive Compound",
              "quantity": 3
            },
            {
              "material": "ARC Motion Core",
              "quantity": 2
            }
          ],
          "workshop": "Explosives Station 3"
        }
      },
      {
        "id": "li'l_smoke_grenade",
        "name": "Li'l Smoke Grenade",
        "category": "grenades",
        "rarity": "Common",
        "description": "A Grenade that pops into a thick but small smoke cloud on impact, blocking visibility from ARC and other Raiders.",
        "stats": {
          "Weight": "0.15",
          "Stack Size": "5",
          "Sell Price": "300",
          "Duration": "6s",
          "Radius": "2.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 5
            },
            {
              "material": "Plastic Parts",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "tagging_grenade",
        "name": "Tagging Grenade",
        "category": "grenades",
        "rarity": "Rare",
        "description": "A grenade that detonates after a delay, tagging Raiders and ARC enemies in an area, allowing you to briefly track their location.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Duration": "30s",
          "Radius": "6m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 1
            },
            {
              "material": "Sensors",
              "quantity": 1
            }
          ],
          "workshop": "Utility Station 3"
        }
      },
      {
        "id": "wasp_driver",
        "name": "Wasp Driver",
        "category": "grenades",
        "rarity": "Rare",
        "description": "Can be recycled into ARC Alloy.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "0.6",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Damage": "80",
          "Radius": "5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Rusted Tools",
              "quantity": 3
            },
            {
              "material": "Mechanical Components",
              "quantity": 5
            },
            {
              "material": "Wasp Driver",
              "quantity": 8
            }
          ],
          "workshop": "Gunsmith 1"
        }
      },
      {
        "id": "hornet_driver",
        "name": "Hornet Driver",
        "category": "grenades",
        "rarity": "Rare",
        "description": "Can be recycled into ARC Alloy.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "0.75",
          "Stack Size": "3",
          "Sell Price": "2000",
          "ARC Stun": "10s",
          "Raider Stun": "0.5s",
          "Radius": "6m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Power Cable",
              "quantity": 3
            },
            {
              "material": "Electrical Components",
              "quantity": 5
            },
            {
              "material": "Hornet Driver",
              "quantity": 6
            }
          ],
          "workshop": "Gear Bench 1"
        }
      },
      {
        "id": "snitch_scanner",
        "name": "Snitch Scanner",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "Can be recycled into ARC Alloy.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "0.75",
          "Stack Size": "3",
          "Sell Price": "2000"
        },
        "crafting": {
          "materials": [
            {
              "material": "Damaged Heat Sink",
              "quantity": 2
            },
            {
              "material": "Electrical Components",
              "quantity": 5
            },
            {
              "material": "Snitch Scanner",
              "quantity": 6
            }
          ],
          "workshop": "Utility Station 1"
        }
      },
      {
        "id": "leaper_pulse_unit",
        "name": "Leaper Pulse Unit",
        "category": "grenades",
        "rarity": "Epic",
        "description": "Can be recycled into crafting materials.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "1.0",
          "Stack Size": "3",
          "Sell Price": "5,000",
          "Damage": "100",
          "Radius": "10m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Fried Motherboard",
              "quantity": 3
            },
            {
              "material": "Advanced Electrical Components",
              "quantity": 5
            },
            {
              "material": "Leaper Pulse Unit",
              "quantity": 4
            }
          ],
          "workshop": "Utility Station 2"
        }
      },
      {
        "id": "fireball_burner",
        "name": "Fireball Burner",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "Can be recycled into ARC Alloy.",
        "stats": {
          "Can Be Found In": "ARC",
          "Weight": "0.5",
          "Stack Size": "3",
          "Sell Price": "640",
          "Damage": "5/s",
          "Duration": "10s",
          "Radius": "2m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Air Freshener",
              "quantity": 1
            },
            {
              "material": "Fireball Burner",
              "quantity": 1
            }
          ],
          "workshop": null
        }
      },
      {
        "id": "crude_explosives",
        "name": "Crude Explosives",
        "category": "grenades",
        "rarity": "Uncommon",
        "description": "Used to craft explosives. Can be recycled into crafting materials",
        "stats": {
          "Can Be Found In": "IndustrialSecurity",
          "Weight": "2",
          "Stack Size": "10",
          "Sell Price": "270",
          "Damage": "15",
          "Radius": "1.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Chemicals",
              "quantity": 6
            }
          ],
          "workshop": "Refiner 1"
        }
      },
      {
        "id": "rubber_duck",
        "name": "Rubber Duck",
        "category": "grenades",
        "rarity": "Common",
        "description": "Always there to lend an ear, should you need it.",
        "stats": {
          "Weight": "0.3",
          "Stack Size": "15",
          "Sell Price": "1,000"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "synthesized_fuel",
        "name": "Synthesized Fuel",
        "category": "grenades",
        "rarity": "Rare",
        "description": "Used to craft utility items and explosives. Can be recycled into chemicals.",
        "stats": {
          "Can Be Found In": "Exodus",
          "Weight": "0.5",
          "Stack Size": "5",
          "Sell Price": "700",
          "Damage": "80",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Synthesized Fuel",
              "quantity": 3
            },
            {
              "material": "Crude Explosives",
              "quantity": 5
            },
            {
              "material": "Pop Trigger",
              "quantity": 5
            }
          ],
          "workshop": "Explosives Station 1"
        }
      }
    ],
    "traps": [
      {
        "id": "blaze_grenade_trap",
        "name": "Blaze Grenade Trap",
        "category": "traps",
        "rarity": "Rare",
        "description": "laser trip wire that detonates a Blaze Grenade.",
        "stats": {
          "Weight": "0.3",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Damage": "5/s",
          "Duration": "10s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Blaze Grenade",
              "quantity": 1
            },
            {
              "material": "Wires",
              "quantity": 1
            }
          ],
          "workshop": "Workbench 1orInventory"
        }
      },
      {
        "id": "gas_grenade_trap",
        "name": "Gas Grenade Trap",
        "category": "traps",
        "rarity": "Common",
        "description": "A laser trip write that detonates a Gas Grenade.",
        "stats": {
          "Weight": "0.25",
          "Stack Size": "3",
          "Sell Price": "300",
          "Stamina": "-25/s",
          "Duration": "20s",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Gas Grenade",
              "quantity": 1
            },
            {
              "material": "Wires",
              "quantity": 1
            }
          ],
          "workshop": "Workbench 1orInventory"
        }
      },
      {
        "id": "lure_grenade_trap",
        "name": "Lure Grenade Trap",
        "category": "traps",
        "rarity": "Uncommon",
        "description": "A laser trip wire that detonates a Lure Grenade",
        "stats": {
          "Weight": "0.25",
          "Stack Size": "3",
          "Sell Price": "1,000",
          "Duration": "15s",
          "Radius": "50m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Lure Grenade",
              "quantity": 1
            },
            {
              "material": "Wires",
              "quantity": 1
            }
          ],
          "workshop": "Workbench 1orInventory"
        }
      },
      {
        "id": "smoke_grenade_trap",
        "name": "Smoke Grenade Trap",
        "category": "traps",
        "rarity": "Rare",
        "description": "A laser trip write that detonates a Smoke Grenade.",
        "stats": {
          "Weight": "0.3",
          "Stack Size": "3",
          "Sell Price": "640",
          "Duration": "20s",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Smoke Grenade",
              "quantity": 1
            },
            {
              "material": "Wires",
              "quantity": 1
            }
          ],
          "workshop": "Workbench 1orInventory"
        }
      },
      {
        "id": "explosive_mine",
        "name": "Explosive Mine",
        "category": "traps",
        "rarity": "Rare",
        "description": "A proximity triggered mine that pops up and explodes, dealing damage to anything within its radius.",
        "stats": {
          "Weight": "0.4",
          "Stack Size": "3",
          "Sell Price": "1,500",
          "Damage": "40",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Explosive Compound",
              "quantity": 1
            },
            {
              "material": "Sensors",
              "quantity": 1
            }
          ],
          "workshop": "Explosives Station 3"
        }
      },
      {
        "id": "gas_mine",
        "name": "Gas Mine",
        "category": "traps",
        "rarity": "Common",
        "description": "A proximity-triggered mine that pops up and deploys a gas cloud that rapidly drains stamina.",
        "stats": {
          "Weight": "0.25",
          "Stack Size": "3",
          "Sell Price": "270",
          "Duration": "20s",
          "Radius": "7.5m",
          "Stamina Drain": "25/s"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "jolt_mine",
        "name": "Jolt Mine",
        "category": "traps",
        "rarity": "Rare",
        "description": "A proximity trigger mine that pops up and stuns anything within its radius.",
        "stats": {
          "Weight": "0.2",
          "Stack Size": "3",
          "Sell Price": "850",
          "ARC Stun": "10s",
          "Raider Stun": "4s",
          "Radius": "5m"
        },
        "crafting": {
          "materials": [
            {
              "material": "Electrical Components",
              "quantity": 1
            },
            {
              "material": "Battery",
              "quantity": 1
            }
          ],
          "workshop": "Explosives Station 2"
        }
      },
      {
        "id": "pulse_mine",
        "name": "Pulse Mine",
        "category": "traps",
        "rarity": "Uncommon",
        "description": "A proximity-triggered mine that pops up and knocks back anything within its radius.",
        "stats": {
          "Weight": "0.25",
          "Stack Size": "3",
          "Sell Price": "470",
          "Radius": "7.5m"
        },
        "crafting": {
          "materials": [],
          "workshop": null
        }
      },
      {
        "id": "deadline",
        "name": "Deadline",
        "category": "traps",
        "rarity": "Epic",
        "description": "A mine that deals damage to anything within its radius once the timer runs out.",
        "stats": {
          "Weight": "1.0",
          "Stack Size": "1",
          "Sell Price": "5,000",
          "Damage": "1,000",
          "Radius": "10m",
          "Timer Duration": "6s"
        },
        "crafting": {
          "materials": [
            {
              "material": "Explosive Compound",
              "quantity": 3
            },
            {
              "material": "ARC Circuitry",
              "quantity": 2
            }
          ],
          "workshop": "Explosives Station 3"
        }
      }
    ]
  },
  "modifications": [
    {
      "id": "compensator_i",
      "name": "Compensator I",
      "slot_type": "Muzzle",
      "rarity": "Common",
      "effects": [
        "Slightly reduces per-shot dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 6
          },
          {
            "material": "Wires",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "muzzle_brake_i",
      "name": "Muzzle Brake I",
      "slot_type": "Muzzle",
      "rarity": "Common",
      "effects": [
        "Slightly reduces both vertical recoil & horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 6
          },
          {
            "material": "Wires",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "shotgun_choke_i",
      "name": "Shotgun Choke I",
      "slot_type": "Muzzle",
      "rarity": "Common",
      "effects": [
        "Slightly reduces base dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 6
          },
          {
            "material": "Wires",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "angled_grip_i",
      "name": "Angled Grip I",
      "slot_type": "Underbarrel",
      "rarity": "Common",
      "effects": [
        "Slightly reduces horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Plastic Parts",
            "quantity": 6
          },
          {
            "material": "Duct Tape",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "vertical_grip_i",
      "name": "Vertical Grip I",
      "slot_type": "Underbarrel",
      "rarity": "Common",
      "effects": [
        "Slightly reduces vertical recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Plastic Parts",
            "quantity": 6
          },
          {
            "material": "Duct Tape",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "extended_light_mag_i",
      "name": "Extended Light Mag I",
      "slot_type": "Light-Mag",
      "rarity": "Common",
      "effects": [
        "Slightly extends the ammo capacity of compatible weapons that use light ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Plastic Parts",
            "quantity": 6
          },
          {
            "material": "Steel Spring",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "extended_medium_mag_i",
      "name": "Extended Medium Mag I",
      "slot_type": "Medium-Mag",
      "rarity": "Common",
      "effects": [
        "Slightly extends the ammo capacity of compatible weapons that use medium ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Plastic Parts",
            "quantity": 6
          },
          {
            "material": "Steel Spring",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "extended_shotgun_mag_i",
      "name": "Extended Shotgun Mag I",
      "slot_type": "Shotgun-Mag",
      "rarity": "Common",
      "effects": [
        "Slightly extends the ammo capacity of shotguns."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Plastic Parts",
            "quantity": 6
          },
          {
            "material": "Steel Spring",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "stable_stock_i",
      "name": "Stable Stock I",
      "slot_type": "Stock",
      "rarity": "Common",
      "effects": [
        "Slightly improves dispersion & recoil recovery time."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Rubber Parts",
            "quantity": 6
          },
          {
            "material": "Duct Tape",
            "quantity": 1
          }
        ],
        "workshop": "Gunsmith 1"
      }
    },
    {
      "id": "compensator_ii",
      "name": "Compensator II",
      "slot_type": "Muzzle",
      "rarity": "Uncommon",
      "effects": [
        "Moderately reduces per-shot dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 4
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "muzzle_brake_ii",
      "name": "Muzzle Brake II",
      "slot_type": "Muzzle",
      "rarity": "Uncommon",
      "effects": [
        "Moderately reduces both vertical recoil & horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 4
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "shotgun_choke_ii",
      "name": "Shotgun Choke II",
      "slot_type": "Muzzle",
      "rarity": "Uncommon",
      "effects": [
        "Moderately reduces base dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [],
        "workshop": null
      }
    },
    {
      "id": "silencer_i",
      "name": "Silencer I",
      "slot_type": "Muzzle",
      "rarity": "Uncommon",
      "effects": [
        "Slightly reduces the amount of noise produced when firing."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [],
        "workshop": null
      }
    },
    {
      "id": "angled_grip_ii",
      "name": "Angled Grip II",
      "slot_type": "Underbarrel",
      "rarity": "Uncommon",
      "effects": [
        "Moderately reduces horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "vertical_grip_ii",
      "name": "Vertical Grip II",
      "slot_type": "Underbarrel",
      "rarity": "Uncommon",
      "effects": [
        "Moderately reduces vertical recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "extended_light_mag_ii",
      "name": "Extended Light Mag II",
      "slot_type": "Light-Mag",
      "rarity": "Uncommon",
      "effects": [
        "Moderately extends the ammo capacity of the compatible weapons that use light ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "extended_medium_mag_ii",
      "name": "Extended Medium Mag II",
      "slot_type": "Medium-Mag",
      "rarity": "Uncommon",
      "effects": [
        "Moderately extends the ammo capacity of compatible weapons that use medium ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "extended_shotgun_mag_ii",
      "name": "Extended Shotgun Mag II",
      "slot_type": "Shotgun-Mag",
      "rarity": "Uncommon",
      "effects": [
        "Moderately extends the ammo capacity of compatible weapons that use shotgun ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "stable_stock_ii",
      "name": "Stable Stock II",
      "slot_type": "Stock",
      "rarity": "Uncommon",
      "effects": [
        "Slightly improves dispersion & recoil recovery time."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mechanical Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 3
          }
        ],
        "workshop": "Gunsmith 2"
      }
    },
    {
      "id": "compensator_iii",
      "name": "Compensator III",
      "slot_type": "Muzzle",
      "rarity": "Rare",
      "effects": [
        "Significantly reduces per-shot dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "muzzle_brake_iii",
      "name": "Muzzle Brake III",
      "slot_type": "Muzzle",
      "rarity": "Rare",
      "effects": [
        "Signifcantly reduces both vertical recoil & horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "shotgun_choke_iii",
      "name": "Shotgun Choke III",
      "slot_type": "Muzzle",
      "rarity": "Rare",
      "effects": [
        "Significantly reduces base dispersion."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "silencer_ii",
      "name": "Silencer II",
      "slot_type": "Muzzle",
      "rarity": "Rare",
      "effects": [
        "Moderately reduces the amount of noise produced when firing."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "silencer_iii",
      "name": "Silencer III",
      "slot_type": "Muzzle",
      "rarity": "Epic",
      "effects": [
        "Significantly reduces the amount of noise produced when firing."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [],
        "workshop": null
      }
    },
    {
      "id": "shotgun_silencer",
      "name": "Shotgun Silencer",
      "slot_type": "Muzzle",
      "rarity": "Epic",
      "effects": [
        "Moderately reduces the amount of noise produced when firing."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "extended_barrel",
      "name": "Extended Barrel",
      "slot_type": "Muzzle",
      "rarity": "Epic",
      "effects": [
        "Moderately increases bullet velocity."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Wires",
            "quantity": 8
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "angled_grip_iii",
      "name": "Angled Grip III",
      "slot_type": "Underbarrel",
      "rarity": "Rare",
      "effects": [
        "Significantly reduces horizontal recoil"
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "vertical_grip_iii",
      "name": "Vertical Grip III",
      "slot_type": "Underbarrel",
      "rarity": "Rare",
      "effects": [
        "Significantly reduces vertical recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "horizontal_grip",
      "name": "Horizontal Grip",
      "slot_type": "Underbarrel",
      "rarity": "Epic",
      "effects": [
        "Moderately reduces both vertical and horizontal recoil."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "extended_light_mag_iii",
      "name": "Extended Light Mag III",
      "slot_type": "Light-Mag",
      "rarity": "Rare",
      "effects": [
        "Significantly extends the ammo capacity of the compatible weapons that use light ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "extended_medium_mag_iii",
      "name": "Extended Medium Mag III",
      "slot_type": "Medium-Mag",
      "rarity": "Rare",
      "effects": [
        "Significantly extends the ammo capacity of compatible weapons that use medium ammo."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "extended_shotgun_mag_iii",
      "name": "Extended Shotgun Mag III",
      "slot_type": "Shotgun-Mag",
      "rarity": "Rare",
      "effects": [
        "Significantly extends the ammo capacity of shotguns."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Steel Spring",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "stable_stock_iii",
      "name": "Stable Stock III",
      "slot_type": "Stock",
      "rarity": "Rare",
      "effects": [
        "Significantly improves dispersion & recoil recovery time"
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "lightweight_stock",
      "name": "Lightweight Stock",
      "slot_type": "Stock",
      "rarity": "Epic",
      "effects": [
        "Moderately improves ADS & draw speed."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "padded_stock",
      "name": "Padded Stock",
      "slot_type": "Stock",
      "rarity": "Epic",
      "effects": [
        "Significantly improves stability."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [
          {
            "material": "Mod Components",
            "quantity": 2
          },
          {
            "material": "Duct Tape",
            "quantity": 5
          }
        ],
        "workshop": "Gunsmith 3"
      }
    },
    {
      "id": "kinetic_converter",
      "name": "Kinetic Converter",
      "slot_type": "Tech-Mod",
      "rarity": "Legendary",
      "effects": [
        "Moderately increases fire rate."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [],
        "workshop": null
      }
    },
    {
      "id": "anvil_splitter",
      "name": "Anvil Splitter",
      "slot_type": "Tech-Mod",
      "rarity": "Legendary",
      "effects": [
        "Tech mod for the Anvil that replaces its bullets with ones that split into 4 weaker projectiles."
      ],
      "compatible_weapons": [],
      "crafting": {
        "materials": [],
        "workshop": null
      }
    }
  ],
  "materials": [
    {
      "id": "metal_parts",
      "name": "Metal Parts",
      "rarity": "Common",
      "weight": "0.1",
      "stack_size": "50",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "plastic_parts",
      "name": "Plastic Parts",
      "rarity": "Common",
      "weight": "0.1",
      "stack_size": "50",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "rubber_parts",
      "name": "Rubber Parts",
      "rarity": "Common",
      "weight": "0.1",
      "stack_size": "50",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "wires",
      "name": "Wires",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "duct_tape",
      "name": "Duct Tape",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "chemicals",
      "name": "Chemicals",
      "rarity": "Common",
      "weight": "0.1",
      "stack_size": "50",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "oil",
      "name": "Oil",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "fabric",
      "name": "Fabric",
      "rarity": "Common",
      "weight": "0.1",
      "stack_size": "50",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "rope",
      "name": "Rope",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "battery",
      "name": "Battery",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "mechanical_components",
      "name": "Mechanical Components",
      "rarity": "Uncommon",
      "weight": "0.8",
      "stack_size": "10",
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 7
          },
          {
            "material": "Rubber Parts",
            "quantity": 3
          }
        ],
        "workshop": "Refiner 1",
        "output_quantity": 1
      }
    },
    {
      "id": "advanced_mechanical_components",
      "name": "Advanced Mechanical Components",
      "rarity": "Rare",
      "weight": "1",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Steel Spring",
            "quantity": 2
          },
          {
            "material": "Mechanical Components",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "mod_components",
      "name": "Mod Components",
      "rarity": "Rare",
      "weight": "1",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Steel Spring",
            "quantity": 2
          },
          {
            "material": "Mechanical Components",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "explosive_compound",
      "name": "Explosive Compound",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Crude Explosives",
            "quantity": 2
          },
          {
            "material": "Oil",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "crude_explosives",
      "name": "Crude Explosives",
      "rarity": "Uncommon",
      "weight": "2",
      "stack_size": "10",
      "crafting": {
        "materials": [
          {
            "material": "Chemicals",
            "quantity": 6
          }
        ],
        "workshop": "Refiner 1",
        "output_quantity": 1
      }
    },
    {
      "id": "simple_gun_parts",
      "name": "Simple Gun Parts",
      "rarity": "Uncommon",
      "weight": "0.3",
      "stack_size": "10",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "light_gun_parts",
      "name": "Light Gun Parts",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Simple Gun Parts",
            "quantity": 4
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "medium_gun_parts",
      "name": "Medium Gun Parts",
      "rarity": "Rare",
      "weight": "0.4",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Simple Gun Parts",
            "quantity": 4
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "heavy_gun_parts",
      "name": "Heavy Gun Parts",
      "rarity": "Rare",
      "weight": "0.5",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Simple Gun Parts",
            "quantity": 4
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "complex_gun_parts",
      "name": "Complex Gun Parts",
      "rarity": "Epic",
      "weight": "1",
      "stack_size": "3",
      "crafting": {
        "materials": [
          {
            "material": "Light Gun Parts",
            "quantity": 2
          },
          {
            "material": "Medium Gun Parts",
            "quantity": 2
          },
          {
            "material": "Heavy Gun Parts",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 3",
        "output_quantity": 1
      }
    },
    {
      "id": "arc_alloy",
      "name": "ARC Alloy",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "arc_circuitry",
      "name": "ARC Circuitry",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "ARC Alloy",
            "quantity": 8
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "arc_motion_core",
      "name": "ARC Motion Core",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "ARC Alloy",
            "quantity": 8
          }
        ],
        "workshop": "Refiner 2",
        "output_quantity": 1
      }
    },
    {
      "id": "arc_powercell",
      "name": "ARC Powercell",
      "rarity": "Common",
      "weight": "0.5",
      "stack_size": "5",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "advanced_arc_powercell",
      "name": "Advanced ARC Powercell",
      "rarity": "Rare",
      "weight": "0.5",
      "stack_size": "5",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "magnetic_accelerator",
      "name": "Magnetic Accelerator",
      "rarity": "Epic",
      "weight": "1.0",
      "stack_size": "3",
      "crafting": {
        "materials": [
          {
            "material": "Advanced Mechanical Components",
            "quantity": 2
          },
          {
            "material": "ARC Motion Core",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 3",
        "output_quantity": 1
      }
    },
    {
      "id": "steel_spring",
      "name": "Steel Spring",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "magnet",
      "name": "Magnet",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "canister",
      "name": "Canister",
      "rarity": "Uncommon",
      "weight": "0.25",
      "stack_size": "15",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "voltage_converter",
      "name": "Voltage Converter",
      "rarity": "Rare",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "power_rod",
      "name": "Power Rod",
      "rarity": "Epic",
      "weight": "1",
      "stack_size": "3",
      "crafting": {
        "materials": [
          {
            "material": "Advanced Electrical Components",
            "quantity": 2
          },
          {
            "material": "ARC Circuitry",
            "quantity": 2
          }
        ],
        "workshop": "Refiner 3",
        "output_quantity": 1
      }
    },
    {
      "id": "exodus_modules",
      "name": "Exodus Modules",
      "rarity": "Epic",
      "weight": "1",
      "stack_size": "3",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "queen_reactor",
      "name": "Queen Reactor",
      "rarity": "Legendary",
      "weight": "10.0",
      "stack_size": "1",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    },
    {
      "id": "matriarch_reactor",
      "name": "Matriarch Reactor",
      "rarity": "Legendary",
      "weight": "10.0",
      "stack_size": "1",
      "crafting": {
        "materials": [],
        "workshop": null,
        "output_quantity": 1
      }
    }
  ],
  "ammo": [
    {
      "id": "light_ammo",
      "name": "Light Ammo",
      "weight": "0.01",
      "stack_size": "100",
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 3
          },
          {
            "material": "Chemicals",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 25
      }
    },
    {
      "id": "medium_ammo",
      "name": "Medium Ammo",
      "weight": "0.025",
      "stack_size": "80",
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 3
          },
          {
            "material": "Chemicals",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 20
      }
    },
    {
      "id": "heavy_ammo",
      "name": "Heavy Ammo",
      "weight": "0.05",
      "stack_size": "40",
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 3
          },
          {
            "material": "Chemicals",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 10
      }
    },
    {
      "id": "shotgun_ammo",
      "name": "Shotgun Ammo",
      "weight": "0.085",
      "stack_size": "20",
      "crafting": {
        "materials": [
          {
            "material": "Metal Parts",
            "quantity": 3
          },
          {
            "material": "Chemicals",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 5
      }
    },
    {
      "id": "energy_clip",
      "name": "Energy Clip",
      "weight": "0.3",
      "stack_size": "5",
      "crafting": {
        "materials": [
          {
            "material": "Advanced ARC Powercell",
            "quantity": 1
          },
          {
            "material": "Battery",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 5
      }
    },
    {
      "id": "launcher_ammo",
      "name": "Launcher Ammo",
      "weight": "0.1",
      "stack_size": "24",
      "crafting": {
        "materials": [
          {
            "material": "ARC Motion Core",
            "quantity": 1
          },
          {
            "material": "Crude Explosives",
            "quantity": 2
          }
        ],
        "workshop": "Workbench 1",
        "output_quantity": 6
      }
    }
  ]
};
