
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, ShoppingCart, FileCode2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PurchaseDialog from './PurchaseDialog';
import ConfigDialog from './ConfigDialog';

export interface Mod {
  id: number;
  title: string;
  image: string;
  description: string;
  url: string;
  repackPrice: string;
  isPaid: boolean;
}

interface ModCardProps {
  mod: Mod;
  isAdmin: boolean;
  onEdit: (mod: Mod) => void;
  onDelete: (id: number) => void;
}

const captureConfig = {
  "Notifications": {
    "EnableEventNotifications": 1,
    "TitleNotification": "Захват Территории",
    "EarlyNotification": "Скоро начнётся новый ивент Захват Территории ",
    "SpawnNotification": "Захват Территории начался на локации ",
    "EndingNotification": "Захват Территори  закончился на локации ",
    "EndingPart2Notification": "вертолет направляется для доставки груза",
    "InsideZoneNotification": "Вы находитесь внутри зоны захвата",
    "OutsideZoneNotification": "Вы находитесь вне зоны захвата"
  },
  "EventGeneral": {
    "MinPlayers": 1,
    "NumberOfKOTHToSpawn": 1,
    "DelayBetweenEarlyNotificationAndSpawn": 300,
    "SpawnDelay": 1200,
    "DeleteCrateTimer": 1200,
    "ZoneProgressionIncrease": 0.5,
    "ZoneProgressionDecrease": 0.5,
    "RadioLifeTime": 1600
  },
  "Mines": {
    "EnableMineSpawn": 1,
    "MineSpawnRadius": 75.0,
    "MineSpawnInterval": 60,
    "MineNumberPerInterval": 1,
    "MineTypes": [
      "BMCaptureMine",
      "BMCaptureBearTrap"
    ]
  },
  "HelicopterSettings": {
    "HelicopterHeight": 200.0,
    "HelicopterSpeed": 60.0
  },
  "Locations": [
    {
      "LocationName": "Североград",
      "LocationPosition": [
        7735.709961,
        119.878998,
        12636.599609
      ],
      "ZoneRadius": 75.0,
      "SpawnChance": 100.0,
      "Mapping": [
        {
          "ClassName": "EMPObject",
          "Position": [7723.200195, 118.439003, 12647.700195],
          "Orientation": [49.411278, 0.000000, -0.000000]
        }
      ],
      "FlagPosition": [
        7737.299316,
        130.124359,
        12640.844727
      ],
      "FlagClassName": "BMCaptureFlag",
      "HelicopterLandingPosition": [
        7755.639160,
        119.968071,
        12544.791016
      ]
    },
    {
      "LocationName": "Военная база 'Сосновка'",
      "LocationPosition": [
        2697.050049,
        364.535004,
        6751.810059
      ],
      "ZoneRadius": 75.0,
      "SpawnChance": 100.0,
      "Mapping": [
        {
          "ClassName": "EMPObject",
          "Position": [2658.110107, 362.937012, 6760.810059],
          "Orientation": [38.610546, 0.000000, -0.000000]
        }
      ],
      "FlagPosition": [
        2697.144775,
        363.701904,
        6755.262207
      ],
      "FlagClassName": "BMCaptureFlag",
      "HelicopterLandingPosition": [
        2660.255859,
        362.971954,
        6758.993164
      ]
    },
    {
      "LocationName": "Военная база 'Балота'",
      "LocationPosition": [
        4936.850098,
        10.739300,
        2481.620117
      ],
      "ZoneRadius": 75.0,
      "SpawnChance": 100.0,
      "Mapping": [
        {
          "ClassName": "EMPObject",
          "Position": [4975.200195, 9.467340, 2459.250000],
          "Orientation": [-63.183510, 0.000000, 0.000000]
        }
      ],
      "FlagPosition": [
        2660.255859,
        9.511921,
        2478.715332
      ],
      "FlagClassName": "BMCaptureFlag",
      "HelicopterLandingPosition": [
        4979.812988,
        9.511916,
        2506.176758
      ]
    },
    {
      "LocationName": "Военная база 'Старое'",
      "LocationPosition": [
        10441.400391,
        283.984985,
        5956.029785
      ],
      "ZoneRadius": 75.0,
      "SpawnChance": 100.0,
      "Mapping": [
        {
          "ClassName": "EMPObject",
          "Position": [10413.700195, 283.868011, 5938.850098],
          "Orientation": [-129.148468, 0.000000, -0.000000]
        }
      ],
      "FlagPosition": [
        10452.589844,
        283.033600,
        5953.009277
      ],
      "FlagClassName": "BMCaptureFlag",
      "HelicopterLandingPosition": [
        10381.267578,
        282.179840,
        5916.229980
      ]
    },
    {
      "LocationName": "Военная база 'Вересник'",
      "LocationPosition": [
        4505.979980,
        321.812988,
        8263.940430
      ],
      "ZoneRadius": 75.0,
      "SpawnChance": 100.0,
      "Mapping": [
        {
          "ClassName": "EMPObject",
          "Position": [4555.089844, 317.576996, 8273.339844],
          "Orientation": [-120.958069, 0.000000, -0.000000]
        }
      ],
      "FlagPosition": [
        4515.600586,
        316.199097,
        8279.964844
      ],
      "FlagClassName": "BMCaptureFlag",
      "HelicopterLandingPosition": [
        4522.343262,
        314.937500,
        8187.429199
      ]
    }
  ],
  "LootSettings": [
    {
      "Item": "Fan_SV98",
      "QuantityMin": 1,
      "QuantityMax": 1,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": [
        {
          "AttachmentName": "HuntingOptic",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        },
        {
          "AttachmentName": "Fan_Mag_SV98_7rnd",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        }
      ]
    },
    {
      "Item": "Fan_Mag_SV98_7rnd",
      "QuantityMin": 2,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "AmmoBox",
      "QuantityMin": 2,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": [
        {
          "AttachmentName": "Fan_AmmoBox_338LM_10rnd",
          "QuantityMin": 2,
          "QuantityMax": 2,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        },
        {
          "AttachmentName": "AmmoBox_762x54_20Rnd",
          "QuantityMin": 12,
          "QuantityMax": 12,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        }
      ]
    },
    {
      "Item": "BM_Medicines_BandageArmy",
      "QuantityMin": 1,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "BM_Medicines_AI2",
      "QuantityMin": 2,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "BM_Medicines_GoldStar",
      "QuantityMin": 1,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "RA_C4",
      "QuantityMin": 0,
      "QuantityMax": 1,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "FOG_Vest_Thor_Green",
      "QuantityMin": 1,
      "QuantityMax": 1,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "FOG_Bag_6ShBagT_Green",
      "QuantityMin": 0,
      "QuantityMax": 1,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "Fan_MP7A1_Mag_40Rnd",
      "QuantityMin": 2,
      "QuantityMax": 4,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "Fan_Ammo_46_30",
      "QuantityMin": 2,
      "QuantityMax": 4,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": []
    },
    {
      "Item": "TF_Maska1Helmet",
      "QuantityMin": 1,
      "QuantityMax": 2,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": [
        {
          "AttachmentName": "TF_Maska1SchVisor",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        }
      ]
    },
    {
      "Item": "Fan_MP7A1",
      "QuantityMin": 1,
      "QuantityMax": 1,
      "HealthMin": 100.0,
      "HealthMax": 100.0,
      "Chance": 100.0,
      "Attachments": [
        {
          "AttachmentName": "Fan_MP7A1_Mag_40Rnd",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        },
        {
          "AttachmentName": "M68Optic",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        },
        {
          "AttachmentName": "Battery9V",
          "QuantityMin": 1,
          "QuantityMax": 1,
          "HealthMin": 100.0,
          "HealthMax": 100.0,
          "Chance": 100.0,
          "Attachments": []
        }
      ]
    }
  ],
  "ZombieSettings": {
    "EnableZombieSpawn": 1,
    "Zombies": [
      {
        "ZombieClassName": "ZmbM_SoldierNormal",
        "QuantityMin": 10,
        "QuantityMax": 25,
        "HealthMin": 80.0,
        "HealthMax": 120.0,
        "SpawnChance": 100.0,
        "SpawnRadius": 75.0,
        "Attachments": []
      }
    ]
  },
  "AnimalSettings": {
    "EnableAnimalSpawn": 0,
    "Animals": []
  }
};

const ModCard: React.FC<ModCardProps> = ({ mod, isAdmin, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  // Extract YouTube video ID from the URL if it's the Capture Flag mod
  const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const isCaptureFlagMod = mod.title === "Capture Flag";
  const youtubeId = isCaptureFlagMod ? getYoutubeVideoId(mod.url) : null;

  return (
    <Card className="h-full flex flex-col bg-card/40 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {isCaptureFlagMod && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&controls=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
            title={mod.title}
          />
        ) : (
          <img
            src={mod.image || '/placeholder.svg'}
            alt={mod.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
        {mod.isPaid && (
          <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-md text-xs font-medium">
            PAID
          </div>
        )}
      </div>
      
      <CardContent className="py-4 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-shine">{mod.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{mod.description}</p>
        <p className="text-primary font-semibold mt-2">Repack Price: {mod.repackPrice}</p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2">
        <a 
          href={mod.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {mod.isPaid ? "View Full Video" : "View on Workshop"}
          </Button>
        </a>
        
        {isCaptureFlagMod && (
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => setShowConfigDialog(true)}
          >
            <FileCode2 className="h-4 w-4 mr-2" />
            View Config
          </Button>
        )}
        
        {mod.isPaid && (
          <Button 
            className="w-full text-sm bg-primary hover:bg-primary/90"
            onClick={() => setShowPurchaseDialog(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Now
          </Button>
        )}
        
        {isAdmin && (
          <div className="w-full flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(mod)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mod "{mod.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(mod.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <PurchaseDialog 
        isOpen={showPurchaseDialog} 
        setIsOpen={setShowPurchaseDialog}
        modTitle={mod.title}
        modPrice={mod.repackPrice}
      />

      {isCaptureFlagMod && (
        <ConfigDialog 
          isOpen={showConfigDialog}
          setIsOpen={setShowConfigDialog}
          config={captureConfig}
        />
      )}
    </Card>
  );
};

export default ModCard;
