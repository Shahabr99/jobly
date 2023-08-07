const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');


class Job {

  // Creates a job for a company and adds it to the database. Returns the new job.
  static async create({ title, salary, equity, company_handle }) {
    const duplicate = await db.query(`SELECT title, salary, equity from jobs WHERE title=$1 AND salary=$2 AND equity=$3`, [title, salary, equity]);
    if(duplicate.rows.length > 0) {
      throw new BadRequestError("Duplicate job found.")
    }
    const result = await db.query(`INSERT INTO jobs(title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) RETURNING title, salary, equity`, [title, salary, equity, company_handle]);
    return result.rows[0]
  }

  // get all the jobs
  static async getAll() {
      const results = await db.query(`SELECT title, salary, equity FROM jobs`);
      if(results.rows.length === 0) throw new NotFoundError("No jobs available");
      return results.rows;
  }

  // Get one job from database
  static async get(id) {
    const job = await db.query(`SELECT title, salary, equity FROM jobs WHERE id=$1`, [id]);
    if (job.rows.length === 0) throw new NotFoundError("No job found")
    return job.rows[0]
  }

  // Change the data related to a job
  static async update(id, {title, salary, equity, company_handle}) {
    const result = await db.query(`UPDATE users SET(title =$1, salary=$2, equity=$3, company_handle=$4) WHERE id=$5 RETURNING title, salary, equity`, [title, salary, equity, company_handle, id]);
    if(result.rows.length === 0) throw new NotFoundError("Job not found")
    return result.rows[0]
  }

  static async remove(id) {
    const result = await db.query(`DELETE FROM jobs WHERE id=$1 RETURNING id`, [id]);
    if(!result) throw new NotFoundError("No job found")
    return result.rows[0]
  }
}



module.exports = Job