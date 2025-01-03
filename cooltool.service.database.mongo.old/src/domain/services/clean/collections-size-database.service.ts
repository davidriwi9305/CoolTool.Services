import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CollectionSizeDatabaseService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: any) {}

  async sizes(): Promise<void> {

    let totalSize = 0;
    let totalDocuments = 0;

    console.log(this.db)

    // Get all collection names
    let collections = await this.db.listCollections().toArray();

    let collectionPromises = collections.map(collection => {
        return this.db.collection(collection.name).stats();
    });

    Promise.all(collectionPromises).then(results => {
        let tableData = [];

        results.forEach(stats => {
            totalSize += stats.size;
            totalDocuments += stats.count;

            tableData.push({
                Collection: stats.ns,
                Size: stats.size,  // Store the size in bytes for sorting
                Documents: stats.count
            });
        });

        // Sort the tableData by size (ascending)
        tableData.sort((a, b) => a.Size - b.Size);

        // Convert sizes to readable format for display
        tableData = tableData.map(item => ({
            Collection: item.Collection,
            Size: this.formatSize(item.Size),
            Documents: item.Documents
        }));

        // Print to console
        this.printInConsole(tableData, totalDocuments, totalSize);
    }).catch(err => console.error("Error retrieving stats:", err));

    return
  }

    private printInConsole(tableData: any[], totalDocuments: number, totalSize: number) {
        console.table(tableData);

        const avgSize = totalDocuments > 0 ? totalSize / totalDocuments : 0;

        console.log("\nTotal Size:", this.formatSize(totalSize));
        console.log("Total Documents:", totalDocuments);
        console.log("Average Document Size:", this.formatSize(avgSize));
    }

    private formatSize(sizeInBytes) {
        const megabytes = sizeInBytes / (1024 * 1024);
        const gigabytes = sizeInBytes / (1024 * 1024 * 1024);
        
        if (gigabytes >= 1) {
            return gigabytes.toFixed(2) + ' GB';
        } else if (megabytes >= 1) {
            return megabytes.toFixed(2) + ' MB';
        } else {
            return sizeInBytes + ' bytes';
        }
    }
}
