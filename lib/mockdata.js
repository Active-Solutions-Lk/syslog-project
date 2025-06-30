

    // Mock data (updated to include detailed upload and download data)
  const users = [
    {
      id: 1,
      name: 'Shaheer',
      status: 'Active',
      totalFiles: 2766,
      totalSize: '0.03 MB',
      created: 2766,
      deleted: 2766,
      fileTypes: [
        {
          type: 'Video',
          createCount: 586,
          readCount: 0,
          deleteCount: 219,
          totalSize: 85744,
          uploads: [
            { name: 'video1.mp4', size: 30000, date: '2025-05-20', time: '14:30', path: '/videos/video1.mp4' },
            { name: 'video2.mp3', size: 55744, date: '2025-05-21', time: '09:15', path: '/videos/video2.mp4' },
            { name: 'aniversary.mp4', size: 0, date: '2025-05-22', time: '11:00', path: '/videos/video3.mp4' },
            { name: 'film.mp4', size: 0, date: '2025-05-23', time: '12:00', path: '/videos/film.mp4' },
            { name: 'watermellon.mp4', size: 0, date: '2025-05-24', time: '13:00', path: '/videos/watermellon.mp4' },
            { name: 'sites.kmv', size: 0, date: '2025-05-25', time: '14:00', path: '/videos/video6.mp4' },
            { name: 'Infor.mp4', size: 0, date: '2025-05-26', time: '15:00', path: '/videos/Infor.mp4' },
            { name: 'IT.mp4', size: 0, date: '2025-05-27', time: '16:00', path: '/videos/video8.mp4' },
            { name: 'Learn.mp4', size: 0, date: '2025-05-28', time: '17:00', path: '/videos/Learn.mp4' },
          ],
          downloads: [],
        },
        {
          type: 'Photo',
          createCount: 970,
          readCount: 0,
          deleteCount: 0,
          totalSize: 146534,
          uploads: [
            { name: 'photo1.jpg', size: 50000, date: '2025-05-19', time: '16:00', path: '/photos/photo1.jpg' },
            { name: 'photo2.jpg', size: 96534, date: '2025-05-20', time: '10:00', path: '/photos/photo2.jpg' },
          ],
          downloads: [],
        },
        {
          type: 'Document',
          createCount: 1156,
          readCount: 0,
          deleteCount: 0,
          totalSize: 595066,
          uploads: [
            { name: 'doc1.pdf', size: 200000, date: '2025-05-18', time: '11:00', path: '/docs/doc1.pdf' },
            { name: 'doc2.pdf', size: 395066, date: '2025-05-19', time: '13:00', path: '/docs/doc2.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 438,
          readCount: 10,
          deleteCount: 73,
          totalSize: 45100,
          uploads: [
            { name: 'file1.txt', size: 25100, date: '2025-05-17', time: '08:00', path: '/other/file1.txt' },
          ],
          downloads: [
            { name: 'file2.txt', size: 20000, date: '2025-05-20', time: '14:00', path: '/other/file2.txt' },
          ],
        },
      ],
      folderId: 'test1',
    },
    {
      id: 2,
      name: 'Active',
      status: 'Inactive',
      totalFiles: 20527,
      totalSize: '2.3 GB',
      created: 200,
      deleted: 100,
      fileTypes: [
        {
          type: 'Video',
          createCount: 500,
          readCount: 10,
          deleteCount: 150,
          totalSize: 75000,
          uploads: [
            { name: 'vid3.mp4', size: 40000, date: '2025-05-15', time: '12:00', path: '/videos/vid3.mp4' },
          ],
          downloads: [
            { name: 'vid4.mp4', size: 35000, date: '2025-05-16', time: '15:00', path: '/videos/vid4.mp4' },
          ],
        },
        {
          type: 'Photo',
          createCount: 800,
          readCount: 5,
          deleteCount: 20,
          totalSize: 120000,
          uploads: [
            { name: 'pic1.jpg', size: 60000, date: '2025-05-14', time: '09:00', path: '/photos/pic1.jpg' },
          ],
          downloads: [
            { name: 'pic2.jpg', size: 60000, date: '2025-05-15', time: '11:00', path: '/photos/pic2.jpg' },
          ],
        },
        {
          type: 'Document',
          createCount: 1000,
          readCount: 0,
          deleteCount: 30,
          totalSize: 500000,
          uploads: [
            { name: 'doc3.pdf', size: 250000, date: '2025-05-13', time: '10:00', path: '/docs/doc3.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 400,
          readCount: 15,
          deleteCount: 50,
          totalSize: 30000,
          uploads: [
            { name: 'misc1.txt', size: 15000, date: '2025-05-12', time: '08:00', path: '/other/misc1.txt' },
          ],
          downloads: [
            { name: 'misc2.txt', size: 15000, date: '2025-05-13', time: '09:00', path: '/other/misc2.txt' },
          ],
        },
      ],
      folderId: 'test2',
    },
    {
      id: 3,
      name: 'Kavishka',
      status: 'Active',
      totalFiles: 1025,
      totalSize: '3.1 GB',
      created: 300,
      deleted: 29,
      fileTypes: [
        {
          type: 'Video',
          createCount: 600,
          readCount: 0,
          deleteCount: 200,
          totalSize: 90000,
          uploads: [
            { name: 'vid5.mp4', size: 45000, date: '2025-05-10', time: '14:00', path: '/videos/vid5.mp4' },
          ],
          downloads: [],
        },
        {
          type: 'Photo',
          createCount: 900,
          readCount: 0,
          deleteCount: 10,
          totalSize: 130000,
          uploads: [
            { name: 'pic3.jpg', size: 65000, date: '2025-05-11', time: '15:00', path: '/photos/pic3.jpg' },
          ],
          downloads: [],
        },
        {
          type: 'Document',
          createCount: 1100,
          readCount: 0,
          deleteCount: 15,
          totalSize: 550000,
          uploads: [
            { name: 'doc4.pdf', size: 275000, date: '2025-05-12', time: '16:00', path: '/docs/doc4.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 450,
          readCount: 5,
          deleteCount: 60,
          totalSize: 35000,
          uploads: [
            { name: 'misc3.txt', size: 17500, date: '2025-05-13', time: '17:00', path: '/other/misc3.txt' },
          ],
          downloads: [],
        },
      ],
      folderId: 'bmw',
    },
    {
      id: 4,
      name: 'Ayesha',
      status: 'Active',
      totalFiles: 526,
      totalSize: '500 MB',
      created: 100,
      deleted: 30,
      fileTypes: [
        {
          type: 'Video',
          createCount: 550,
          readCount: 0,
          deleteCount: 180,
          totalSize: 80000,
          uploads: [
            { name: 'vid6.mp4', size: 40000, date: '2025-05-14', time: '18:00', path: '/videos/vid6.mp4' },
          ],
          downloads: [],
        },
        {
          type: 'Photo',
          createCount: 850,
          readCount: 0,
          deleteCount: 5,
          totalSize: 110000,
          uploads: [
            { name: 'pic4.jpg', size: 55000, date: '2025-05-15', time: '19:00', path: '/photos/pic4.jpg' },
          ],
          downloads: [],
        },
        {
          type: 'Document',
          createCount: 1050,
          readCount: 0,
          deleteCount: 25,
          totalSize: 480000,
          uploads: [
            { name: 'doc5.pdf', size: 240000, date: '2025-05-16', time: '20:00', path: '/docs/doc5.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 420,
          readCount: 8,
          deleteCount: 40,
          totalSize: 28000,
          uploads: [
            { name: 'misc4.txt', size: 14000, date: '2025-05-17', time: '21:00', path: '/other/misc4.txt' },
          ],
          downloads: [],
        },
      ],
      folderId: 'folder4',
    },
    {
      id:5,
      name: 'Janitha',
      status: 'Inactive',
      totalFiles: 225,
      totalSize: 'N/A',
      created: 'N/A',
      deleted: 'N/A',
      fileTypes: [
        {
          type: 'Video',
          createCount: 500,
          readCount: 0,
          deleteCount: 150,
          totalSize: 70000,
          uploads: [
            { name: 'vid7.mp4', size: 35000, date: '2025-05-18', time: '22:00', path: '/videos/vid7.mp4' },
          ],
          downloads: [],
        },
        {
          type: 'Photo',
          createCount: 800,
          readCount: 0,
          deleteCount: 10,
          totalSize: 100000,
          uploads: [
            { name: 'pic5.jpg', size: 50000, date: '2025-05-19', time: '23:00', path: '/photos/pic5.jpg' },
          ],
          downloads: [],
        },
        {
          type: 'Document',
          createCount: 900,
          readCount: 0,
          deleteCount: 20,
          totalSize: 450000,
          uploads: [
            { name: 'doc6.pdf', size: 225000, date: '2025-05-20', time: '00:00', path: '/docs/doc6.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 400,
          readCount: 10,
          deleteCount: 50,
          totalSize: 25000,
          uploads: [
            { name: 'misc5.txt', size: 12500, date: '2025-05-21', time: '01:00', path: '/other/misc5.txt' },
          ],
          downloads: [],
        },
      ],
      folderId: 'folder5',
    },
    {
      id:6,
      name: 'Kamal',
      status: 'Active',
      totalFiles: 2529,
      totalSize: 'N/A',
      created: 'N/A',
      deleted: 'N/A',
      fileTypes: [
        {
          type: 'Video',
          createCount: 580,
          readCount: 0,
          deleteCount: 210,
          totalSize: 85000,
          uploads: [
            { name: 'vid8.mp4', size: 42500, date: '2025-05-22', time: '02:00', path: '/videos/vid8.mp4' },
          ],
          downloads: [],
        },
        {
          type: 'Photo',
          createCount: 950,
          readCount: 0,
          deleteCount: 0,
          totalSize: 140000,
          uploads: [
            { name: 'pic6.jpg', size: 70000, date: '2025-05-23', time: '03:00', path: '/photos/pic6.jpg' },
          ],
          downloads: [],
        },
        {
          type: 'Document',
          createCount: 1150,
          readCount: 0,
          deleteCount: 0,
          totalSize: 590000,
          uploads: [
            { name: 'doc7.pdf', size: 295000, date: '2025-05-24', time: '04:00', path: '/docs/doc7.pdf' },
          ],
          downloads: [],
        },
        {
          type: 'Other',
          createCount: 430,
          readCount: 10,
          deleteCount: 70,
          totalSize: 45000,
          uploads: [
            { name: 'misc6.txt', size: 22500, date: '2025-05-25', time: '05:00', path: '/other/misc6.txt' },
          ],
          downloads: [],
        },
      ],
      folderId: 'test1',
    },
  ]


  export default users;