import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDevices, AddFolder } from '../server-side';

export function AddFolderModal() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [device, setDevice] = useState('office-nas');
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [fetchDeviceLoading, setFetchDeviceLoading] = useState(true);
  const [fetchDeviceError, setFetchDeviceError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [comboboxOpen, setComboboxOpen] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      setFetchDeviceLoading(true);
      setFetchDeviceError(null);
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) {
        setFetchDeviceError(error.message);
      } finally {
        setFetchDeviceLoading(false);
      }
    };
    getDevices();
  }, []);

  // Debug devices and selected device
  useEffect(() => {
    //console.log('Devices:', devices);
    //console.log('Selected device:', device, devices.find((d) => d.host_name === device));
  }, [devices, device]);

  const handleEditDevice = (device, event) => {
    event.stopPropagation();
    //console.log('Edit device:', device);
    alert(`Edit ${device.host_name} - Implement your edit logic here`);
  };

  const handleDeleteDevice = (device, event) => {
    event.stopPropagation();
    //console.log('Delete device:', device);
    if (confirm(`Are you sure you want to delete ${device.host_name}?`)) {
      alert(`Delete ${device.host_name} - Implement your delete logic here`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setStatusType('');

    try {
      const selectedDevice = devices.find((d) => d.host_name === device);
      if (!selectedDevice) {
        setStatusMessage('Invalid device selected.');
        setStatusType('error');
        return;
      }

      const secureFolder = {
        nickname,
        device: selectedDevice.id,
        path
      };

      const response = await AddFolder(secureFolder);

      if (response.success) {
        setStatusMessage('Folder added successfully!');
        setStatusType('success');
        setTimeout(() => {
          setOpen(false);
          setNickname('');
          setDevice('');
          setPath('');
          setStatusMessage('');
          setStatusType('');
        }, 1500);
      } else {
        setStatusMessage('Failed to add folder: ' + response.error);
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('An error occurred: ' + error.message);
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    if (fetchDeviceLoading) return 'Loading...';
    if (fetchDeviceError) return 'Error loading devices';
    return 'Select device';
  };

  const selectedDevice = devices.find((d) => d.host_name === device);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='bg-white rounded-lg border text-xs border-specialBlue text-title hover:bg-blue-100 flex items-center'
          variant='outline'
          size='sm'
        >
          <img
            src='/images/foldericon.png'
            alt='Folder Icon'
            width={18}
            height={18}
            className='h-auto w-8'
          />
          Add Folder
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white border-0 rounded-lg shadow-lg'>
        <DialogHeader className='bg-blue-400 text-white p-4 rounded-t-lg'>
          <DialogTitle className='text-lg font-semibold'>
            Folder Details
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter the details to add a new folder, including nickname, device, and path.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='text-gray-700 flex-1 flex-col gap-2 p-4'>
            <div className='flex-1 flex-col gap-8'>
              <Label
                htmlFor='nickname'
                className='text-right text-gray-700 font-medium'
              >
                Nick Name
              </Label>
              <Input
                id='nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='Eg: HR Documents'
                className='border-0 border-b-2 ms-o ps-0 border-gray-400 rounded-none bg-white text-subtitle focus:ring-0 w-full'
              />
            </div>
            <div className='flex flex-col items-start mt-2 gap-1'>
              <Label
                htmlFor='device'
                className='text-center text-gray-700 font-medium'
              >
                Device
              </Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className='bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-full justify-between hover:bg-transparent'
                    disabled={fetchDeviceLoading || !!fetchDeviceError}
                  >
                    {selectedDevice ? selectedDevice.host_name : getPlaceholderText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" style={{ zIndex: 2000 }}>
                  <Command>
                    <CommandInput placeholder="Search device..." />
                    <CommandList>
                      <CommandEmpty>
                        {fetchDeviceLoading && "Loading..."}
                        {fetchDeviceError && fetchDeviceError}
                        {!fetchDeviceLoading && !fetchDeviceError && devices.length === 0 && "No devices found"}
                        {!fetchDeviceLoading && !fetchDeviceError && devices.length > 0 && "No device found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {!fetchDeviceLoading && !fetchDeviceError && devices.length === 0 && (
                          <CommandItem disabled>No devices available</CommandItem>
                        )}
                        {!fetchDeviceLoading &&
                          !fetchDeviceError &&
                          devices.map((d) => (
                            <CommandItem
                              key={d.id}
                              value={d.host_name}
                              onSelect={(currentValue) => {
                                setDevice(currentValue === device ? "" : currentValue);
                                setComboboxOpen(false);
                              }}
                              className="flex items-center justify-between group"
                            >
                              <div className="flex items-center">
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    device === d.host_name ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {d.host_name}
                              </div>
                              <div className="flex items-center gap-1"> {/* Removed opacity-0 group-hover */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleEditDevice(d, e)}
                                  className="h-6 w-6 p-0 border border-blue-500" // Added border for visibility
                                  aria-label={`Edit ${d.host_name}`}
                                >
                                  <Edit2 className="h-3 w-3 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteDevice(d, e)}
                                  className="h-6 w-6 p-0 border border-red-500" // Added border for visibility
                                  aria-label={`Delete ${d.host_name}`}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex-1 flex-col gap-8 mt-2'>
              <Label
                htmlFor='path'
                className='text-right text-gray-700 font-medium'
              >
                Path
              </Label>
              <Input
                id='path'
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder='Eg : /RsyslogTest/test1'
                className='border-0 border-b-2 ms-o ps-0 border-gray-400 rounded-none bg-white text-subtitle focus:ring-0 w-full'
              />
            </div>
            <div className='flex-1 flex-col gap-8 mt-2'>
              {statusMessage && (
                <div
                  className={`mt-4 text-sm font-medium ${
                    statusType === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {statusMessage}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className='bg-gray-100 p-4 rounded-b-lg flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              className='bg-transparent border border-critical text-critical hover:bg-red-100 rounded-md px-8 py-2'
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-transparent border border-info text-info hover:bg-blue-100 rounded-md px-8 py-2 flex items-center'
              disabled={loading}
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <svg
                    className='animate-spin h-4 w-4 text-info'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v8z'
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Add Folder'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}